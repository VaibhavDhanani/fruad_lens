import express from 'express';
import { transferMoney, getUserTransactions } from '../controllers/TransferController.js';
import Transaction from '../models/transaction.js';
const router = express.Router();
router.get('/all', async (req, res) => {
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
router.post('/transfer/', transferMoney);
router.get('/:userId', getUserTransactions); 

export default router;
