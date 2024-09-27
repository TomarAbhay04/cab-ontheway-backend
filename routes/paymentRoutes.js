import express from 'express';
import {initialPayment} from '../controllers/paymentController.js';

const router = express.Router();

// Route for initiating payment
router.post('/initial-payment', initialPayment);    

export default router;