import express from 'express';
import { verifyOTPAndRegister, loginUser, getUserDetails, sendOTP } from '../controllers/userController.js'; 
import protect  from '../middleware/authMiddleware.js';   


const router = express.Router();

// router.post('/signup', registerUser);
router.post('/signup', verifyOTPAndRegister);

router.post('/send-otp', sendOTP);

router.post('/login', loginUser);

router.get('/profile', protect, getUserDetails);

export default router;