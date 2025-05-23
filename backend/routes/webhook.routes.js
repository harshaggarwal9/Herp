import express from 'express';
import { handleRazorpayWebhook } from '../controllers/webhook.controller.js';



const router = express.Router();

// Razorpay will POST here
router.post('/', handleRazorpayWebhook);

export default router;
