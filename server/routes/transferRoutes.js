import express from 'express';
import { transferMoney ,createTransaction,authorizeTransaction,markFraud} from '../controllers/TransferController.js';
import Transaction from '../models/transaction.js';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddleware.js'
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const transactions = await Transaction.find({
      $or: [{ user: userId }, { counterparty: userId }],
    })
      .populate("user", "username full_name")
      .populate("counterparty", "username full_name")
      .sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Transaction fetch error:", err);
    res.status(500).json({ message: "Could not fetch transactions" });
  }
}
);

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user counterparty');
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.patch('/:id/fraud', async (req, res) => {
  const { id } = req.params;
  const { is_fraud } = req.body;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    transaction.is_fraud = is_fraud;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.post('/transfer',authMiddleware, transferMoney);

router.post('/initiate',authMiddleware, createTransaction);

router.post(`/authorize/:transactionID`,authorizeTransaction);
router.put('/transaction/:id',authMiddleware, markFraud);

export default router;
