import mongoose from "mongoose";
const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }],
  date: { type: Date, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  marks:{type:Number, requirded: true},
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
