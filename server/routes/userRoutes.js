import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerUser, loginUser, getAllUsers ,getUserInfo,getSummary} from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/all', authMiddleware, getAllUsers);
router.get('/info',authMiddleware, getUserInfo);
router.get('/user-summary/:userId',getSummary);
export default router;
