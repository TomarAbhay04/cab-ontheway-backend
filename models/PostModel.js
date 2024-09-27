import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
        ref: "User",  // Referencing the User model
        required: true,
    },
    });

    
const PostModel = mongoose.model('Post', postSchema);

export default PostModel;