import mongoose from "mongoose";

export const connectDB = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI).then((data)=>{
    })
  } catch (error) {
    console.log("Error connecting database")
  }
}
