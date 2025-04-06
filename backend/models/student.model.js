import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  userId : {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  RollNumber:{
    type:String,
    required:true,
    unique:true,
    maxLength:8,
  },
  classId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Class",
    required:true,
  },
  stream: {
    type: String,
    enum: ["Arts", "Commerce", "Science-Maths", "Science-Biology"],
    validate: {
      validator: async function (value) {
        const ClassModel = mongoose.model("Class");
        const classData = await ClassModel.findById(this.classId);
        
        if (!classData) return false; // Class not found
        
        return classData.className === "11" || classData.className === "12";
      },
      message: "Stream is only allowed for students in class 11 and 12.",
    },
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
},{timestamps:true})

export default mongoose.model("Student", studentSchema);