import mongoose from "mongoose";

// Validator to enforce maximum of 4 classes per teacher
function arrayLimit(val) {
  return val.length <= 4;
}

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subjects: [
    {
      type: String,
      required: true,
    }
  ],
  classes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      }
    ],
    default: [],
    validate: {
      validator: arrayLimit,
      message: 'A teacher cannot be assigned more than 4 classes',
    }
  },
  experience: {
    type: Number,
  },
  qualification: {
    type: String,
  }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
