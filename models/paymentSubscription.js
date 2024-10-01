import mongoose from "mongoose";

const paymentSubscriptionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        default: 199, // Fixed amount for the monthly subscription
      },
      paymentDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      validTill: {
        type: Date,
        required: true,
        default: () => Date.now() + 28 * 24 * 60 * 60 * 1000, // Adds 28 days
      },
      paymentStatus: {
        type: String,
        enum: ['successful', 'failed'],
        default: 'successful', // Assuming the payment is successful for now
      },
    });

    
const PaymentSubscription = mongoose.model("PaymentSubscription", paymentSubscriptionSchema);

export default PaymentSubscription;