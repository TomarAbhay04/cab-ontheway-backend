import Post from "../models/PostModel.js";
import mongoose from 'mongoose';

export const createPost = async (req, res) => {
  const { title, description = '', imageUrl = null } = req.body;

    if(!title){
      return res.status(400).json({ message: 'Please provide title.' });
    }

  try {
    // console.log('data', req.body);
    const userId = req.user._id;
    const newPost = new Post({
      title,
      description,
      imageUrl,
      userId,
    });

    await newPost.save();
    return res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Server error. Unable to create post.' });
  }
};


    export const getPosts = async (req, res) => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
          // If no posts are found, return a specific message
          return res.status(404).json({
            success: false,
            message: 'No posts available',
          });
        }    

         // Fetch all posts from the database
        res.status(200).json({
          success: true,
          data: posts,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Server Error',
        });
      }
      };

// Get all posts by a specific user
export const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from the request params

    // Optional: Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Correct usage of ObjectId constructor with 'new'
    const posts = await Post.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No posts found for this user.' });
    }

    // Return the user's posts
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching posts by userId:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Unable to fetch posts.',
    });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the post by postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the user making the request using req.user (set by protect middleware)
    const user = await User.findById(req.user._id);

    // Check if the post is already saved
    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: 'Post already saved' });
    }

    // Save the post to the user's savedPosts array
    user.savedPosts.push(postId);
    await user.save();

    res.status(200).json({ message: 'Post saved successfully' });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
      
      export const deletePost = async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
    
          await post.remove();
    
          res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: 'An error occurred' });
        }
      };


      // export const updatePost = async (req, res) => {
      //   try {
      //     const post = await Post.findById(req.params.id);
      //     if (!post) {
      //       return res.status(404).json({ error: 'Post not found' });
      //     }
    
      //     const { title, description } = req.body;
    
      //     post.title = title;
      //     post.description = description;
    
      //     await post.save();
    
      //     res.status(200).json({ message: 'Post updated successfully', post });
      //   } catch (error) {
      //     res.status(500).json({ error: 'An error occurred' });
      //   }
      // };


