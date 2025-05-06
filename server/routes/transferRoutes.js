import express from 'express';
import { transferMoney, getUserTransactions } from '../controllers/TransferController.js';

const router = express.Router();

router.post('/transfer/', transferMoney);
router.get('/:userId', getUserTransactions); 
export default router;
