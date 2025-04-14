import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // get from Razorpay Dashboard
  key_secret: process.env.RAZORPAY_SECRET   // keep this secret!
});

export default instance;
