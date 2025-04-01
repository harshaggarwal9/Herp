import Student from "../models/student.model.js";
import User from "../models/userModel.js";
import classModel from "../models/class.model.js";
export const createStudent = async (req,res)=>{
  const {id}=req.params;
  const {RollNumber,className}=req.body;
  try {
    const classData= await classModel.findOne({className});
    const user=await User.findById(id);
    if(!user) return res.status(404).json({message:"User not found"});
    const student = await Student.create({
      userId:user._id,
      RollNumber:RollNumber,
      classId:classData._id,
      });
      await classData.updateOne({ $push: { students: student._id } });
      const studentData = await Student.findById(student._id).populate([
        {path:"userId"},
        {path:"classId"}
      ]);
      res.status(201).json({student:studentData,message:"student created successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"internal server error"});
  }
}
export const getStudent = async (req,res)=>{
  const {id} = req.params;
  try{
    const user = await Student.findById(id).populate([
      { path: "userId" },
      { path: "classId" }
      // { path: "parents" }
    ]);
  if(!user) res.status(404).json({success:false,message:"user not found"});
  res.json(user);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"internal server error"});
  }
}