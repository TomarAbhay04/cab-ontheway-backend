import express from 'express';
import {  checkSubscription } from '../controllers/userSubController.js';

const router = express.Router();


router.get('/check-subscription/:userId', checkSubscription);



export default router;