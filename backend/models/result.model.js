
import mongoose from "mongoose";
const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true},
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  marks:{type:Number, requirded: true},
}, { timestamps: true });
export default mongoose.model("Result", resultSchema);