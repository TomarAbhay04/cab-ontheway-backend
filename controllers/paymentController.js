import axios from 'axios';  
import dotenv from 'dotenv';

dotenv.config();

export const initialPayment = async (req, res) => { 
    const { amount, email, phone } = req.body; // You might want to customize this based on your requirements

    const options = {
        method: 'POST',
        url: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': process.env.PHONEPE_VERIFY_KEY, // Your PhonePe verify key
        },
        data: {
            merchantId: process.env.PHONEPE_MERCHANT_ID, // Your Merchant ID
            merchantTransactionId: `txn-${Date.now()}`,
            amount: amount,
            currency: 'INR',
            returnUrl: 'your-app-url.com/payment-success', // Redirect URL after success
            phone: phone, // Optional, can be used for customer identification
            email: email, // Optional, can be used for customer identification
        },
    };

    try {
        const response = await axios(options);
        return res.json({ paymentUrl: response.data.paymentUrl });
    } catch (error) {
        console.error('Error initiating payment:', error.message);
        return res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
};
