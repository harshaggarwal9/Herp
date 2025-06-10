import Razorpay from "../Utils/razorpay.js";
import Fee from "../models/fees.model.js";
import studentModel from "../models/student.model.js";
import crypto from "crypto";
export const createChallan = async(req,res)=>{
  const {amount,dueDate, RollNumber} = req.body;
  try {
    const student = await studentModel.findOne({ RollNumber});
     if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    const fee=await Fee.create({
      student:student._id,
      amount,
      dueDate,
    })
    res.json(fee);
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
      amount: fee.amount * 100, 
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
      razorpayKey:process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, feeId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }
    fee.status = "Paid";
    fee.paymentDetails = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amountPaid: fee.amount,
      paymentDate: new Date(),
      status: "Success"
    };

    await fee.save();

    return res.status(200).json({ message: "Payment verified and fee updated" });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const fetchAll = async(req,res)=>{
  try {
    const PendingUser = await Fee.find({status:"Pending"}).populate(
      {
        path: "student",
      },
    );
    res.status(200).json(PendingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
export const deleteChallan = async(req,res)=>{
  const {id} = req.params;
  try {
    const remainingChallan = await Fee.findByIdAndDelete(id);
    res.status(200).json({ message: "Challan deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}