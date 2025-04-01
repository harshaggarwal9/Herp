import mongoose from "mongoose";
const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  marksObtained: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Marks", marksSchema);
