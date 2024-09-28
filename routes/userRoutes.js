import express from 'express';
import { registerUser, loginUser, getUserDetails } from '../controllers/userController.js'; 
import protect  from '../middleware/authMiddleware.js';   


const router = express.Router();

router.post('/signup', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getUserDetails);

export default router;