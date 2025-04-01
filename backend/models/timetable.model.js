import mongoose from "mongoose";
const timetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true }],
}, { timestamps: true });

export default mongoose.model("Timetable", timetableSchema);
