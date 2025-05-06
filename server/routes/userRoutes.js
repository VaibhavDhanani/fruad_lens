import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerUser, loginUser, getAllUsers ,getUserInfo} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserInfo);

router.get('/all', authMiddleware, getAllUsers);
export default router;
