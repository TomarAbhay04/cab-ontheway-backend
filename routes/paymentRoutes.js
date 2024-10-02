import express from 'express';  
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// to create an order

router.post('/create-order', createOrder);

// to verify the payment

router.post('/verify-payment', verifyPayment);


export default router;