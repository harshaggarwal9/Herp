import Razorpay from "../Utils/razorpay.js";
import Fee from "../models/fees.model.js";
import studentModel from "../models/student.model.js";
import crypto from "crypto";
export const createChallan = async(req,res)=>{
  const {id} = req.params;
  const {amount,dueDate} = req.body;
  try {
    const student = await studentModel.findById(id);
    const fee=await Fee.create({
      student,
      amount,
      dueDate,
    })
    res.json(Fee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
export const initiatePayment = async (req, res) => {
  const { feeId } = req.params;

  try {
    const fee = await Fee.findById(feeId).populate([
      {path:"student"},
    ]);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    const options = {
      amount: fee.amount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_${fee._id}`,
      payment_capture: 1,
    };

    const order = await Razorpay.orders.create(options);
    await Fee.findByIdAndUpdate(fee._id, {
      paymentDetails: {
        orderId: order.id,
        status: "Initiated",
      }
    });    
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      student: fee.student,
      feeId: fee._id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
export const verifyPayment = async(req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,feeId } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await Fee.findByIdAndUpdate(feeId, {
      status: "Paid",
      paidAmount: Fee.amount,
      $push: {
        paymentHistory: {
          amountPaid: fee.amount,
          date: new Date(),
          method: "Razorpay"
        }
      }
    });  
    res.status(200).json({ message: "Payment verified" });
    
  } else {
    res.status(400).json({ message: "Payment verification failed" });
  }

};
export const checkfeestatus=async(req,res)=>{
  const {id} = req.params;
  try {
    const student = await studentModel.findById(id);
    const fee = await feeModel.findOne({student:student._id});
    res.status(200).json(fee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}