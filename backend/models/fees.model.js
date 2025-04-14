import mongoose from "mongoose";

const paymentInfoSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String },
  signature: { type: String },
  amountPaid: { type: Number },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Initiated", "Success", "Failed"], default: "Initiated" },
}, { _id: false });

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  amount: { type: Number, required: true },

  dueDate: { type: Date, required: true },

  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },

  paymentDetails: paymentInfoSchema, // Razorpay-related details

}, { timestamps: true });

export default mongoose.model("Fee", feeSchema);

