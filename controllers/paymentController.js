import Razorpay from 'razorpay';
import Payment from '../models/payment.js'; // Adjust the import path according to your file structure
import { v4 as uuidv4 } from 'uuid'; // For generating a unique receipt ID if needed
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

// Create Order
export const createOrder = async (req, res) => {
    const { userId, amount } = req.body;
  
    try {
      console.log("Creating order with amount:", amount, "for user ID:", userId);
  
      // Create an order in Razorpay
      const options = {
        amount: amount * 100, // Convert amount to paisa
        currency: 'INR',
        receipt: uuidv4(), // Unique receipt ID
        payment_capture: 1, // Auto-capture payment
      };
  
      const order = await razorpay.orders.create(options);
      console.log("Razorpay order created:", order);
  
       
      return res.status(201).json({ order: { id: order.id, currency: options.currency, amount: options.amount }, order });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  };
  
 // Verify Payment
export const verifyPayment = async (req, res) => {
  console.log("Incoming request to verify payment");

  const { userId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  console.log("Request Body:", req.body);
  
  try {
    // Check if the required fields exist
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error('Missing required fields for payment verification');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("Verifying payment with payment ID:", razorpay_payment_id, "and order ID:", razorpay_order_id);
    
    // Create the body to verify
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    // Log the expected signature for comparison
    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      // Signature is valid
      const payment = new Payment({
        userId,
        amount: req.body.amount, // Use the amount from the request body
        orderId: razorpay_order_id, // Use the order_id from the request body
        currency: 'INR', // Assuming you're using INR
        status: 'completed', // Update the status
        razorpay_payment_id, // Store the payment ID
        razorpay_signature, // Store the signature
        receipt: req.body.receipt // You can also pass receipt if needed
      });

      await payment.save();
      console.log("Payment record created:", payment);
      
      return res.status(200).json({ success: true });
    } else {
      console.log("Invalid signature comparison");
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
};
