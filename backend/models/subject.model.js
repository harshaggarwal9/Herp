import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Class", 
    required: true 
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Teacher" 
  },
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);
