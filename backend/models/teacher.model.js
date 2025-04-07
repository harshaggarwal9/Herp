import mongoose from "mongoose";

// Define the validator function BEFORE schema
function arrayLimit(val) {
  return val.length <= 4; // or 4 if that's your actual limit
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
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
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
