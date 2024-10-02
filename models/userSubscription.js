import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      subscription_start_date: {
        type: Date,
        required: true,
      },
      subscription_end_date: {
        type: Date,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      subscription_type: {
        type: String,
        enum: ['monthly'], // Extendable for future subscription types
        default: 'monthly',
      },
      last_payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment', // Reference to the most recent payment made
      },
    });


    
const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);

export default UserSubscription;