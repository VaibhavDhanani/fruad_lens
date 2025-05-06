import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/all', authMiddleware, getAllUsers);

export default router;
