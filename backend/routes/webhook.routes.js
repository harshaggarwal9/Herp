import express from 'express';
import { handleRazorpayWebhook } from '../controllers/webhook.controller.js';



const router = express.Router();
router.post('/', handleRazorpayWebhook);

export default router;
