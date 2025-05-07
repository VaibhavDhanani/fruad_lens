import User from "../models/user.js";
import Transaction from "../models/transaction.js";
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
  
    console.log(req.body);
  
    const amt = parseFloat(amount);
    if (!receiverUsername || !senderId || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: "Invalid transaction details" });
    }
  
    // Parse senderId and extract username
    const senderData = JSON.parse(senderId);
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

