import Post from "../models/PostModel.js";

export const createPost = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    return res.status(400).json({ message: 'Please provide title, description, and image URL.' });
  }

  try {

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
        const posts = await Post.find(); // Fetch all posts from the database
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


      export const getPostById = async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          res.status(200).json(post);
        } catch (error) {
          res.status(500).json({ error: 'An error occurred' });
        }
      };


      export const updatePost = async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
    
          const { title, description } = req.body;
    
          post.title = title;
          post.description = description;
    
          await post.save();
    
          res.status(200).json({ message: 'Post updated successfully', post });
        } catch (error) {
          res.status(500).json({ error: 'An error occurred' });
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

