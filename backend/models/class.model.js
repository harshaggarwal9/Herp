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
  students: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
  ],
  teachers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
  ],
  subjects: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }
  ],
  // New field to track which teacher teaches which subject in a class
  subjectTeachers: [
    {
      subject: {
        type: String,
        required: true
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Class", classSchema);

