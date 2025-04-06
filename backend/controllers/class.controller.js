import classModel from "../models/class.model.js";
import Teacher from "../models/teacher.model.js";
export const createClass = async (req,res)=>{
  const {className,section} = req.body;
  try {
    // const student = await Student.findOne({RollNumber})
     const Class = await classModel.create({
          className,
          section,
          // $push : student._id,
      });
      res.status(201).json({message: "Class created successfully", Class});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  
  }
}
export const fetchClasses = async(req,res)=>{
  try {
    const classes = await classModel.find({})
    res.status(200).json({message: "Classes fetched successfully", classes});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const fetchClassesbyid = async(req,res)=>{
  const {id} = req.params
  try {
    const classById= await classModel.findById(id)
    res.status(200).json({message: "Class fetched successfully", classById});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const deleteClass = async(req,res)=>{
  const {id}=req.params
  try {
    const classById= await classModel.findByIdAndDelete(id)
    res.status(200).json({message: "Class deleted successfully", classById});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const assignClass = async(req,res)=>{
  const {id}=req.params;
  const {className,section} = req.body;
  try {
    const user = await Teacher.findById(id);
    if(!user) res.status(404).json({success:false,message : "teacher not found"});
    const classId = await classModel.findOne({className,section});
    if(!classId) res.status(404).json({success:false,message : "class not created"})
    const assignedTeacher  = await classModel.findByIdAndUpdate(classId._id,{$push:{teachers:user._id}},{new:true});
    const assignedClass = await Teacher.findByIdAndUpdate(user._id,{$push:{classes:classId._id}},{new : true});
    res.status(200).json({success:true,message:"teacher assigned to class"});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}