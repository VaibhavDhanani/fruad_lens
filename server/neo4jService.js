// services/neo4jService.js
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Don't create a global session - create a new one for each function
// This avoids "cannot run directly on a session with an open transaction" errors

export const addUserToNeo4j = async (user) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MERGE (u:User {username: $username})
      ON CREATE SET 
        u.full_name = $full_name,
        u.gender = $gender,
        u.pan_card = $pan_card,
        u.balance = $balance,
        u.createdAt = timestamp(),
        u.latest_login = $latest_login
      RETURN u
      `,
      {
        username: user.username,
        full_name: user.full_name || '',
        gender: user.gender || '',
        pan_card: user.pan_card || '',
        balance: user.balance || 50000,
        latest_login: user.latest_login ? user.latest_login.getTime() : null,
      }
    );

    console.log(`[Neo4j] User created/updated: ${user.username}`);
    return result.records.length > 0;
  } catch (error) {
    console.error(`[Neo4j Error] Failed to add user ${user.username}:`, error);
    throw error;
  } finally {
    await session.close();
  }
};

export const addTransactionToNeo4j = async (transaction) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (sender:User {username: $senderUsername}), (receiver:User {username: $receiverUsername})
      CREATE (sender)-[t:SENT_TO {
        amount: $amount,
        description: $description,
        status: $status,
        createdAt: timestamp(),
        transaction_id: $transactionId,
        device_id: $device_id,
        ip_address: $ip_address,
        is_fraud: $is_fraud
      }]->(receiver)
      RETURN t
      `,
      {
        senderUsername: transaction.senderUsername,
        receiverUsername: transaction.receiverUsername,
        amount: transaction.transaction_amount,
        description: transaction.description || '',
        status: transaction.status,
        transactionId: transaction._id ? transaction._id.toString() : '',
        device_id: transaction.device_id || '',
        ip_address: transaction.ip_address || '',
        is_fraud: transaction.is_fraud || false,
      }
    );

    console.log(`[Neo4j] Transaction logged: ${transaction._id}`);
    return result.records.length > 0;
  } catch (error) {
    console.error(`[Neo4j Error] Failed to add transaction ${transaction._id}:`, error);
    throw error;
  } finally {
    await session.close();
  }
};

export const detectVelocityAnomaly = async ({ senderUsername, transaction_amount }) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (u:User {username: $senderUsername})-[r:SENT_TO]->(receiver:User)
      WHERE datetime().epochMillis - r.createdAt <= 24 * 60 * 60 * 1000
      RETURN AVG(toFloat(r.amount)) AS avg_amount, MAX(toFloat(r.amount)) AS max_amount
      `,
      { senderUsername }
    );

    // Handle case when there are no records or invalid data
    if (result.records.length === 0 || !result.records[0].get('avg_amount') || !result.records[0].get('max_amount')) {
      console.log(`[Neo4j] No transaction history found for ${senderUsername}`);
      return false; // No anomaly if there's no history
    }

    const record = result.records[0];
    const avgAmount = (typeof record.get('avg_amount') === 'number') ? record.get('avg_amount') : 0;
    const maxAmount = (typeof record.get('max_amount') === 'number') ? record.get('max_amount') : 0;
    console.log("avg amount:" +  avgAmount);
    // Define your anomaly threshold here (only if we have transaction history)
    if (avgAmount > 0) {
      const isAnomaly = transaction_amount > 2 * avgAmount || 
                        (maxAmount > 0 && transaction_amount > 1.5 * maxAmount);
      console.log("Velocity Anomali:" +isAnomaly);
      return isAnomaly;
    }

    return false;
  } catch (error) {
    console.error("Velocity anomaly detection failed:", error);
    return false;
  } finally {
    await session.close();
  }
};

export const detectGeoAnomaly = async (transaction) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (sender:User {username: $senderUsername})-[r:SENT_TO]->(receiver:User)
      WHERE datetime().epochMillis - r.createdAt < 30 * 24 * 60 * 60 * 1000 
      RETURN AVG(r.transaction_distance) AS avg_distance
      `,
      {
        senderUsername: transaction.senderUsername,
      }
    );

    // Handle case when there are no records or no transaction_distance
    const avgDistance = result.records.length > 0 && result.records[0].get("avg_distance") 
      ? result.records[0].get("avg_distance") 
      : 0;
    
    const currentDistance = transaction.transaction_distance || 0;

    // Only detect anomaly if we have history and a current distance
    if (avgDistance > 0 && currentDistance > 0) {
      const isFraud = currentDistance > avgDistance * 2; // Threshold for location anomaly
      console.log(`[Neo4j] Geo anomaly for ${transaction._id}: ${isFraud ? 'POTENTIAL FRAUD' : 'CLEAN'}`);
      return isFraud;
    }
    
    return false;
  } catch (error) {
    console.error(`[Neo4j Error] Geo anomaly detection failed for transaction ${transaction._id}:`, error);
    return false; // Return false instead of throwing error
  } finally {
    await session.close();
  }
};

export const detectDeviceAnomaly = async (transaction) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (sender:User {username: $senderUsername})-[r:SENT_TO]->(receiver:User)
      RETURN COLLECT(DISTINCT r.device_id) AS known_devices, COLLECT(DISTINCT r.ip_address) AS known_ips
      `,
      {
        senderUsername: transaction.senderUsername,
      }
    );

    const knownDevices = result.records.length > 0 ? (result.records[0].get("known_devices") || []) : [];
    const knownIPs = result.records.length > 0 ? (result.records[0].get("known_ips") || []) : [];

    // Only consider it fraud if we have history and new device/IP
    const hasHistory = knownDevices.length > 0 || knownIPs.length > 0;
    
    if (hasHistory && transaction.device_id && transaction.ip_address) {
      const isFraud = !knownDevices.includes(transaction.device_id) || !knownIPs.includes(transaction.ip_address);
      console.log(`[Neo4j] Device anomaly for ${transaction._id}: ${isFraud ? 'POTENTIAL FRAUD' : 'CLEAN'}`);
      return isFraud;
    }
    
    return false;
  } catch (error) {
    console.error(`[Neo4j Error] Device anomaly detection failed for transaction ${transaction._id}:`, error);
    return false; // Return false instead of throwing error
  } finally {
    await session.close();
  }
};