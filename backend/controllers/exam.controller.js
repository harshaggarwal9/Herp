import { truncates } from "bcryptjs";
import classModel from "../models/class.model.js";
import examModel from "../models/exam.model.js";
import subjectModel from "../models/subject.model.js";
export const createExam = async(req,res)=>{
  const {name,date,marks,subject,className}=req.body;
  try {
    const classDoc = await classModel.find({className}); 
    const classIds = classDoc.map(cls => cls._id);
    const subjectDoc = await subjectModel.findOne({name:subject});
    console.log(subjectDoc);
    const Exam = await examModel.create({
      name,
      date,
      marks,
      subject:subjectDoc,
      class:classIds,
    })
    res.status(201).json({success:true,message:"exam created sucessfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
export const findExambyclass = async(req,res)=>{
  const {id}=req.params;
  try {
    const classDoc = await classModel.findById(id);
    const examDocs = await examModel.find({ class: { $in: [classDoc._id] } });
    res.status(201).json(examDocs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
export const findExambySubject = async(req,res)=>{
  const {id}=req.params;
  try {
    const subjectDoc = await subjectModel.findById(id);
    const examDocs = await examModel.find({subject:subjectDoc._id});
    res.status(201).json(examDocs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}