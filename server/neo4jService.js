// services/neo4jService.js
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

export const addUserToNeo4j = async (user) => {
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
  }
};

  export const addTransactionToNeo4j = async (transaction) => {
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
  }
};

export const detectFraud = async (transaction) => {
  try {
    const result = await session.run(
      `
      MATCH (sender:User {username: $senderUsername})
      RETURN COUNT(sender) > 0 as is_fraud
      `,
      {
        senderUsername: transaction.senderUsername,
      }
    );

    const isFraud = result.records[0].get('is_fraud');
    console.log(`[Neo4j] Fraud check for transaction ${transaction._id}: ${isFraud ? 'POTENTIAL FRAUD' : 'CLEAN'}`);
    return isFraud;
  } catch (error) {
    console.error(`[Neo4j Error] Failed to detect fraud for transaction ${transaction._id}:`, error);
    throw error;
  }
};
