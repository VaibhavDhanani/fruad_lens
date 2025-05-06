import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerUser, loginUser, getAllUsers ,getUserInfo} from '../controllers/userController.js';
import Transaction from "../models/transaction.js";
import User from '../models/user.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserInfo);
router.get('/all', authMiddleware, getAllUsers);

router.get('/user-summary/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({username:userId})
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(user)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const transactions = await Transaction.find({
        user: user._id,
        timestamp: { $gte: sevenDaysAgo }
      });
      console.log(transactions)
  
      let income = 0;
      let expense = 0;
  
      transactions.forEach(tx => {
        if (tx.transaction_type === 'CREDIT') income += tx.transaction_amount;
        else if (tx.transaction_type === 'DEBIT') expense += tx.transaction_amount;
      });
  
      res.json({ income, expense });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
export default router;
