import Student from "../models/student.model.js";
import User from "../models/userModel.js";
import classModel from "../models/class.model.js";
import parentModel from "../models/parent.model.js";
export const createStudent = async (req,res)=>{
  const {id}=req.params;
  const {RollNumber,className,section,phoneNumber}=req.body;
  try {
    const parent = await parentModel.findOne({phoneNumber});
    if (!parent) res.status(404).json({message:"parent not exist first create parent"});
    const classData= await classModel.findOne({className,section});
    if(!classData)  res.status.json({message:"class not exist first create class"});
    const user=await User.findById(id);
    if(!user) return res.status(404).json({message:"User not found"});
    const student = await Student.create({
      userId:user._id,
      RollNumber:RollNumber,
      classId:classData._id,
      parent:parent._id
      });
      await classData.updateOne({ $push: { students: student._id } });
      await parent.updateOne({$push : {childrens:student._id}});
      const studentData = await Student.findById(student._id).populate([
        {path:"userId"},
        {path:"classId"},
        {path:"parent"},
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
export const deleteStudent = async(req,res)=>{
  const {id}=req.params
  const classData=await classModel.findOne({students:id})
  await classData.updateOne({ $pull: { students:id } });
  try {
    const StudentById= await Student.findByIdAndDelete(id)
    res.status(200).json({message: "Student deleted successfully", StudentById});
    
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
