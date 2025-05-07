import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import User from '../models/user.js';
import { registerUser, loginUser, getAllUsers ,getUserInfo,getSummary} from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/all', authMiddleware, getAllUsers);
router.get('/info',authMiddleware, getUserInfo);
router.get('/user-summary/:userId',getSummary);
router.put('/update-pan', async (req, res) => {
    const { username, pan_card } = req.body;
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { pan_card },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  
      res.status(200).json({ message: 'PAN updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update PAN' });
    }
  });
  router.put('/update-gender', async (req, res) => {
    const { username, gender } = req.body;
    console.log(username , gender)
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { gender },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
  
      res.status(200).json({ message: 'Gender updated successfully', user: updatedUser });
    } catch (error) {
      
        console.error('Error updating gender:', error);
      
      
      res.status(500).json({ error: 'Failed to update gender' });
    }
  });
  
  
  
export default router;
  