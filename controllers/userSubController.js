import UserSubscription from "../models/userSubscription.js";
import User from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay with your Key ID and Secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});




// Controller to check subscription status
export const checkSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Checking subscription for userId: ${userId}`);
    
    // Find the most recent payment for the user
    const payment = await PaymentSubscription.findOne({ userId }).sort({ paymentDate: -1 });
    if (!payment) {
      return res.status(404).json({
        message: 'No payment record found',
      });
    }

    // Check if the subscription is still valid
    const currentDate = new Date();
    const isActive = currentDate <= payment.validTill;

    return res.status(200).json({
      message: isActive ? 'Subscription is active' : 'Subscription has expired',
      hasActiveSubscription: isActive,
      validTill: payment.validTill,
    });
  } catch (error) {
    console.error("Error checking subscription for userId:", userId, error.message);
    return res.status(500).json({
      message: 'Error checking subscription',
      error: error.message,
    });
  }
};

