import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    default: "A",
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
},{timestamps:true})

export default mongoose.model("Class", classSchema);
