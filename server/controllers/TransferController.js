import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import { addTransactionToNeo4j,detectDeviceAnomaly,detectGeoAnomaly,detectVelocityAnomaly, detectRingPattern, detectStarPattern } from "../neo4jService.js";
export const transferMoney = async (req, res) => {
  try {
    const {
      senderId,
      receiverUsername,
      amount,
      description,
      device_id,
      ip_address,
      sender_lat,
      sender_long,
      beneficiary_lat,
      beneficiary_long
    } = req.body;


    const amt = parseFloat(amount);
    if (!receiverUsername || !senderId || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: "Invalid transaction details" });
    }

    // Parse senderId and extract username
    let senderData;

    // if (typeof senderId === 'string') {
    //   senderData = JSON.parse(senderId);
    // } else {
    //   senderData = senderId; // Assuming senderId is already an object
    // }
    senderData = User.findOne({_id:senderId});
    const senderUsername = senderData.username;

    // Find sender and receiver using their usernames
    const [sender, receiver] = await Promise.all([
      User.findOne({ username: senderUsername }),
      User.findOne({ username: receiverUsername })
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender._id.equals(receiver._id)) {
      return res.status(400).json({ message: "Cannot transfer to self" });
    }

    if (sender.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update balances
    sender.balance -= amt;
    receiver.balance += amt;

    await Promise.all([sender.save(), receiver.save()]);

    // Create single transaction from sender's perspective
    await Transaction.create({
      user: sender._id,
      counterparty: receiver._id,
      transaction_amount: amt,
      transaction_type: 'DEBIT',
      description: description || '',
      device_id: device_id || '',
      ip_address: ip_address || '',
      sender_lat: sender_lat || null,
      sender_long: sender_long || null,
      beneficiary_lat: beneficiary_lat || null,
      beneficiary_long: beneficiary_long || null,
      is_fraud: false,
      status: "SUCCESS",
      transaction_hour: new Date().getHours(),
      is_weekend: [0, 6].includes(new Date().getDay()),
      beneficiary_account_number: receiver._id || ''
    });


    return res.status(200).json({ message: "Transaction successful" });

  } catch (error) {
    console.error("Transfer Error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export const createTransaction = async (req, res) => {
  try {
    const {
      senderId,
      receiverUsername,
      amount,
      account_balance,
      description,
      device_id,
      ip_address,
      sender_lat,
      sender_long,
      beneficiary_lat,
      beneficiary_long
    } = req.body;

    const amt = parseFloat(amount);
    if (!receiverUsername || !senderId || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: "Invalid transaction details" });
    }

    // const senderData = JSON.parse(senderId);
    // const senderUsername = senderData.username;

    const [sender, receiver] = await Promise.all([
      User.findOne({ _id: senderId }),
      User.findOne({ username: receiverUsername })
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender._id.equals(receiver._id)) {
      return res.status(400).json({ message: "Cannot transfer to self" });
    }

    const now = new Date();

    const account_age = Math.floor((now - sender.createdAt) / (1000 * 60 * 60 ));
    

    // Get the sender's last transaction to calculate time since last transaction
    const lastTransaction = await Transaction.findOne({ user: sender._id }).sort({ timestamp: -1 }).limit(1);

    // Calculate time since last transaction (in hours)
    const timeSinceLastTx = lastTransaction
      ? (new Date() - new Date(lastTransaction.timestamp)) / (1000 * 60 * 60) // time in hours
      : 0;

    // Calculate transaction to balance ratio
    const transactionToBalanceRatio = account_balance > 0 ? amt / account_balance : 0;

    // Calculate average transaction distance in the past 7 days
    // Fetch all sender transactions in the last 7 days
    const pastTransactions = await Transaction.find({
      user: sender._id,
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Average distance of valid transactions
    const past7dDebits = pastTransactions.filter(
      tx => tx.transaction_type === 'DEBIT' && typeof tx.transaction_amount === 'number'
    );
    
    const avgTransactionAmount7d = past7dDebits.length > 0
    ? past7dDebits.reduce((acc, tx) => acc + tx.transaction_amount, 0) / past7dDebits.length
    : 0;

    const transactionDistance = Math.abs(amount- avgTransactionAmount7d);
    
      const distanceTxs = pastTransactions.filter(tx => typeof tx.transaction_distance === 'number');

      const distance_avg_transaction_7d = distanceTxs.length > 0
        ? distanceTxs.reduce((acc, tx) => acc + tx.transaction_distance, 0) / distanceTxs.length
        : 0;
      

    // Count failed transactions in last 7 days
    const failedTransactionCount7d = pastTransactions.filter(tx => tx.status === 'FAILED').length;

    // Just create a pending transaction
    const transaction = await Transaction.create({
      user: sender._id,
      counterparty: receiver._id,
      transaction_amount: amt,
      transaction_type: 'DEBIT',
      description: description || '',
      account_balance: account_balance,
      device_id: device_id || '',
      ip_address: ip_address || '',
      sender_lat: sender_lat || null,
      sender_long: sender_long || null,
      beneficiary_lat: beneficiary_lat || null,
      beneficiary_long: beneficiary_long || null,
      transaction_distance: transactionDistance,
      avg_transaction_amount_7d: avgTransactionAmount7d, 
      failed_transaction_count_7d:failedTransactionCount7d,
      distance_avg_transaction_7d: distance_avg_transaction_7d,
      time_since_last_transaction: timeSinceLastTx,
      transaction_to_balance_ratio: transactionToBalanceRatio,
      account_age:account_age,
      is_fraud: false,
      status: "PENDING",
      transaction_hour: new Date().getHours(),
      is_weekend: [0, 6].includes(new Date().getDay()),
      is_night: new Date().getHours() >= 20 || new Date().getHours() < 6,  // Example: mark as night if the time is between 8PM and 6AM
      beneficiary_account_number: receiver._id || ''
    });

   
    
    const transactionData = {
      _id: transaction._id,
      senderUsername: sender.username,
      transaction_amount: amt,
      transaction_distance: transactionDistance,
      device_id,
      ip_address
    };

    try {
      // Run anomaly detection in sequence (not parallel) to avoid session issues
      const velocityAnomaly = await detectVelocityAnomaly(transactionData);
      const geoAnomaly = await detectGeoAnomaly(transactionData);
      const deviceAnomaly = await detectDeviceAnomaly(transactionData);
      const ringPatternAnomaly = await detectRingPattern(sender.username);
      const starPatternAnomaly = await detectStarPattern(sender.username, 5);

      // If any anomaly is detected, mark the transaction for review
      const isFraudSuspected = velocityAnomaly || geoAnomaly || deviceAnomaly || ringPatternAnomaly || starPatternAnomaly;
      
      if (isFraudSuspected) {
        // Update transaction status to indicate fraud review needed
        transaction.status = "FRAUD";
        transaction.is_fraud = true;
        
        // // Store which anomalies were detected
        // transaction.anomalies = {
        //   velocity: velocityAnomaly,
        //   geo: geoAnomaly,
        //   device: deviceAnomaly
        // };
        await addTransactionToNeo4j({
          _id: transaction._id,  // Include the _id field
          senderUsername: sender.username,
          receiverUsername: receiver.username,
          transaction_amount: amt,
          description,
          status: "PENDING",
          device_id,
          ip_address,
          is_fraud: transaction.is_fraud || false  // Make sure to include this field
        });
        await transaction.save();
        
        return res.status(200).json({
          message: "Transaction flagged for fraud review",
          transaction: transaction,
          anomalies: {
            velocity: velocityAnomaly,
            geo: geoAnomaly,
            device: deviceAnomaly
          }
        });
      }
    } catch (error) {
      console.error("Anomaly detection error:", error);
      // Don't fail the transaction if anomaly detection fails
      // Just log the error and continue
    }
    
    return res.status(200).json({
      message: "Transaction created, pending authorization",
      transaction: transaction
    });

  } catch (error) {
    console.error("Create Transaction Error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export const authorizeTransaction = async (req, res) => {
  try {
    const { transactionID } = req.params;
    const {password} = req.body; // expecting raw 6-digit code
    
    // if (!password || typeof pin !== 'string' || !/^\d{6}$/.test(password)) {
    //   return res.status(400).json({ message: "Invalid PIN format. Must be a 6-digit number." });
    // }

    const transaction = await Transaction.findById(transactionID);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({ message: "Transaction is not pending" });
    }

    const sender = await User.findById(transaction.user);
    const receiver = await User.findById(transaction.counterparty);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User(s) not found" });
    }

    // Compare the raw PIN (stored in sender.transaction_pin)
    if (sender.mpin !== password) {
      transaction.status = 'FAILED';
      await transaction.save();
      return res.status(401).json({ message: "Incorrect PIN" });
    }

    // Check sufficient balance
    if (sender.balance < transaction.transaction_amount) {
      transaction.status = 'FAILED';
      await transaction.save();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update balances
    sender.balance -= transaction.transaction_amount;
    receiver.balance += transaction.transaction_amount;

    await Promise.all([
      sender.save(),
      receiver.save()
    ]);

    transaction.status = 'SUCCESS';
    await transaction.save();

    return res.status(200).json({ message: "Transaction authorized and completed successfully" });

  } catch (error) {
    console.error("Authorize Transaction Error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
export const markFraud = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = "FRAUD";
    transaction.is_fraud=1;
    await transaction.save();

    res.status(200).json({ message: "Transaction marked as fraud", transaction });
  } catch (error) {
    console.error("Error marking transaction as fraud:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};