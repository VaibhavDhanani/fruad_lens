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

    const amt = parseFloat(amount);
    if (!receiverUsername || !senderId || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: "Invalid transaction details" });
    }

    const [sender, receiver] = await Promise.all([
      User.findOne({ username: senderId }),
      User.findOne({ username: receiverUsername })
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    if (sender._id.equals(receiver._id)) {
      return res.status(400).json({ message: "Cannot transfer to self" });
    }

    if (sender.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Process transaction
    sender.balance -= amt;
    receiver.balance += amt;

    const [updatedSender, updatedReceiver] = await Promise.all([
      sender.save(),
      receiver.save()
    ]);

    const now = new Date();
    const commonFields = {
      transaction_amount: amt,
      description,
      device_id,
      ip_address,
      sender_lat,
      sender_long,
      beneficiary_lat,
      beneficiary_long,
      is_weekend: [0, 6].includes(now.getDay()),
      transaction_hour: now.getHours(),
      is_fraud: false
    };

    await Transaction.create([
      {
        user: sender._id,
        counterparty: receiver._id,
        transaction_type: "DEBIT",
        beneficiary_account_number: receiver.username,
        ...commonFields
      },
      {
        user: receiver._id,
        counterparty: sender._id,
        transaction_type: "CREDIT",
        description: `Received from ${sender.username}`,
        beneficiary_account_number: sender.username,
        ...commonFields
      }
    ]);

    return res.status(200).json({
      message: "Transaction successful",
      senderBalance: updatedSender.balance,
      receiverBalance: updatedReceiver.balance
    });

  } catch (err) {
    console.error("Transfer error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const user= await User.find({username:userId});
    const transactions = await Transaction.find({ user: user })
      .populate("counterparty", "username full_name")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Transaction fetch error:", err);
    res.status(500).json({ message: "Could not fetch transactions" });
  }
};
