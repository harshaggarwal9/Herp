import mongoose from "mongoose";
const teacherSchema= new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  subjects:[
    {
      type:String,
      required:true,
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
    validate: [arrayLimit, '{PATH} exceeds the limit of 6']
  },
  experience: {
    type: Number, 
    // min: 0,
  },
  qualification: {
    type: String, 
  },
 
},{timestamps:true})
function arrayLimit(val) {
  return val.length <= 6;
}

const Teacher=mongoose.model("Teacher",teacherSchema)
export default Teacher
