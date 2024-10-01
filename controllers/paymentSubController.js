import PaymentSubscription from "../models/paymentSubscription.js";

import User from "../models/userModel.js";

export const createPaymentSubscription = async (req, res) => {

    try {
      console.log(req.body);
        const { userId } = req.body; // Get the userId from request body
    
        // Find the user from the User collection
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Create a new payment record
        const newPayment = new PaymentSubscription({
          userId, // Store the user reference
          amount: 199, // Fixed amount for the monthly subscription
      });

        await newPayment.save();
    
        return res.status(201).json({
          message: 'Payment successful',
          payment: newPayment,
        });
      } catch (error) {
        return res.status(500).json({
          message: 'Payment failed',
          error: error.message,
        });
      }
    };
  



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






    

  // export const checkSubscription = async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  //     console.log(`Checking subscription for userId: ${userId}`);
  
  //     // Find the most recent payment for the user
  //     const payment = await PaymentSubscription.findOne({ userId }).sort({ paymentDate: -1 });
  //     console.log("Most recent payment record found:", payment);
  
  //     if (!payment) {
  //       console.log("No payment record found for userId:", userId);
  //       return res.status(404).json({
  //         message: 'No payment record found',
  //       });
  //     }
  
  //     // Check if the subscription is still valid
  //     const currentDate = new Date();
  //     console.log("Current date:", currentDate, "Valid till:", payment.validTill);
  
  //     if (currentDate <= payment.validTill) {
  //       console.log("Subscription is active until:", payment.validTill);
  //       return res.status(200).json({
  //         message: 'Subscription is active',
  //         validTill: payment.validTill,
  //       });
  //     } else {
  //       console.log("Subscription expired on:", payment.validTill);
  //       return res.status(403).json({
  //         message: 'Subscription has expired. Please renew your subscription.',
  //         validTill: payment.validTill,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error checking subscription for userId:", userId, error.message);
  //     return res.status(500).json({
  //       message: 'Error checking subscription',
  //       error: error.message,
  //     });
  //   }
  // };
  