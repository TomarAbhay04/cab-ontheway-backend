import express from 'express';
import { createPaymentSubscription, checkSubscription } from '../controllers/paymentSubController.js';

const router = express.Router();

router.post('/create-payment', createPaymentSubscription);


router.get('/check-subscription/:userId', checkSubscription);


export default router;