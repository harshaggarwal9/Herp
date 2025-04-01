import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    minLength:[8,"Password must have 8 characters"],
  },
  role:{
    type:String,
    enum:["admin","student","teacher","parent"],
  },
  
},{timestamps:true})
const User = mongoose.model("User",userSchema);
export default User