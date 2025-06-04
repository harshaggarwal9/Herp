import examModel from "../models/exam.model.js";
import resultModel from "../models/result.model.js";
import studentModel from "../models/student.model.js";
import subjectModel from "../models/subject.model.js";
export const createResult = async(req,res)=>{
  const {id}=req.params;
  const {marks,rollNumber,subjects}=req.body;
  try {
    const exam = await examModel.findById(id);
    const student = await studentModel.findOne({ RollNumber:rollNumber});
    const subject = await subjectModel.findOne({name:subjects});
    if (!exam.class.includes(student.classId)) {
      return res.status(400).json({ message: "Student is not registered for this exam." });
    }
    const result = await resultModel.create({
      marks:marks,
      student:student._id,
      subject:subject._id,
      exam:exam._id
    })
    res.status(201).json({message:"result created successfully",result:result});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
export const fetchResults=async(req,res)=>{
  const id=req.user._id;
  const student = await studentModel.findOne({userId:id});
  try {
    const result = await resultModel.find({student:student._id}).populate([
      {path:"subject"},
      {path:"exam"},
      {path:"student"},
    ]);
    if(!result) res.status(404).json({message:"no student found with this id"});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}