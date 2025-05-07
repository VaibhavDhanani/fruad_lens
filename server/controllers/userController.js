import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Transaction from '../models/transaction.js';
// @desc    Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, full_name, mpin, gender, pan_card } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Save user directly (no password hashing since you're using mpin)
    const newUser = new User({ username, full_name, mpin, gender, pan_card });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Login user
export const loginUser = async (req, res) => {
  try {
    const { username, mpin } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.mpin !== mpin) {
      return res.status(400).json({ message: 'Invalid MPIN' });
    }

    // ✅ Update latest_login timestamp
    user.latest_login = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { mpin: _, ...userData } = user.toObject(); // Remove mpin from response
    return res.status(200).json({ user: userData, token });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};




// @desc    Get all users (protected)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hashed_password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id}).select('full_name username balance');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSummary = async (req, res) => {
  try {
    const userid = req.params.userId;
    // console.log("Requested User ID: ", userid); // log user ID received from the URL

    const user = await User.findById(userid);
    if (!user) {
      // console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const transactions = await Transaction.find({
      $or: [{ user: user._id }, { counterparty: user._id }],
      createdAt: { $gte: sevenDaysAgo }
    });

    // console.log("Transactions found:", transactions); // log the fetched transactions

    let income = 0;
    let expense = 0;

    transactions.forEach(tx => {
      if (tx.counterparty.toString() === user._id.toString()) {
        income += tx.transaction_amount;
      } else if (tx.user.toString() === user._id.toString()) {
        expense += tx.transaction_amount;
      }
    });

    res.json({ income, expense });
  } catch (err) {
    console.error("Error in getSummary:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

