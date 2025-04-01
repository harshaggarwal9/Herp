import mongoose from "mongoose";
const parentSchema = mongoose.Schema({
  userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
  },
  childrens:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true,
  }],
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/, 
  },
},{timestamps:true})
export default mongoose.model("Parent",parentSchema)