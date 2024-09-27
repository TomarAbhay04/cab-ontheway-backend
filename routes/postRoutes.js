import express from 'express'; 
// import upload from '../middleware/multer.js'; 
import protect  from '../middleware/authMiddleware.js';

import { getPosts, createPost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);

// Route for creating a post with an image
router.post('/create', protect, createPost);

export default router;