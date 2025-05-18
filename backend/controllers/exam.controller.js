
import classModel from '../models/class.model.js';
import subjectModel from '../models/subject.model.js';
import examModel from '../models/exam.model.js';

export async function createExam(req, res) {
  try {
    const { name, date, marks, subject, classes: classIds } = req.body;

    // verify subject exists
    const subjectDoc = await subjectModel.findOne({name:subject});
    if (!subjectDoc) {
      return res.status(400).json({ success: false, message: 'Subject not found' });
    }

    // verify classes exist
    const validClassDocs = await classModel.find({ _id: { $in: classIds } });
    if (validClassDocs.length !== classIds.length) {
      return res.status(400).json({ success: false, message: 'Some selected classes are invalid' });
    }

    // create exam
    const exam = await examModel.create({
      name,
      date,
      marks,
      subject: subjectDoc._id,
      class: classIds
    });

    res.status(201).json({ success: true, message: 'Exam created successfully', exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
export const fetchExam = async (req, res) => {
  const { name, subject, className, section } = req.body;

  try {
    // 1) Find the Class doc
    const classDoc = await classModel.findOne({ className, section });
    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // 2) Find the Subject doc
    const subjectDoc = await subjectModel.findOne({ name: subject });
    if (!subjectDoc) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // 3) Await the Exam query
    const exam = await examModel.findOne({
      name,
      subject: subjectDoc._id,
      class: classDoc._id
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // 4) Return 200 OK with the document
    res.status(200).json({ success: true, exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
