import express from 'express'; 
// import upload from '../middleware/multer.js'; 
import protect  from '../middleware/authMiddleware.js';

import { getPosts, createPost, getPostsByUserId, savePost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);

// Route for fetching a User's post by ID
router.get('/:userId', getPostsByUserId);

// Route for creating a post with an image
router.post('/create', protect, createPost);

// Route for saving a post
router.post('/save/:postId', savePost);

export default router;