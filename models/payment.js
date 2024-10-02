import mongoose  from "mongoose";

const paymentSchema = new mongoose.Schema({
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
    razorpay_payment_id: {
        type: String,
        // required: true,
      },
      razorpay_order_id: {
        type: String,
        // required: true,
      },
      razorpay_signature: {
        type: String,
        // required: true,
      },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    currency: {
        type: String,
        default: 'INR',
      },
      status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'completed'],
        default: 'created',
      },
      receipt: {
        type: String,
      },
      subscription_type: {
        type: String,
        enum: ['monthly'], // In case you want to add other subscription types later
        default: 'monthly',
      },
    });


const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;