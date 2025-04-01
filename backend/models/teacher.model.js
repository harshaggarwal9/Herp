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
  classes:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Class",
    required:true,
    }
  ],
  experience: {
    type: Number, 
    min: 0,
  },
  qualification: {
    type: String, 
  },
},{timestamps:true})
const Teacher=mongoose.model("Teacher",teacherSchema)
export default Teacher
