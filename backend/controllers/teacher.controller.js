import Teacher from "../models/teacher.model.js"
import classModel from "../models/class.model.js";
import Subject from "../models/subject.model.js";
import User from "../models/userModel.js";
export const createTeacher = async(req,res)=>{
  const {id}=req.params;
  const {subjects,experience,qualifications}=req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const teacherData = await Teacher.create({
      userId: user._id,
      subjects:subjects,
      experience:experience,
      qualification:qualifications,
    })
    res.status(201).json({ message: "Teacher created successfully" ,Teacher:teacherData});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const fetchTeacher = async (req, res) => {
  const { userId } = req.params;           
  try {
  const teacher = await Teacher
      .findOne({ userId })
      .populate("userId")             
      .populate("classes")      
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found for this user" });
    }
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const assignTeacher = async (req, res) => {
  const { id: teacherId } = req.params;
  const { classId, subject } = req.body;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) 
      return res.status(404).json({ message: "Teacher not found" });

    const classDoc = await classModel.findById(classId);
    if (!classDoc) 
      return res.status(404).json({ message: "Class not found" });

    const subjectDoc = await Subject.findOne({ name: subject });
    if (!subjectDoc) 
      return res.status(404).json({ message: "Subject not found" });
    if (teacher.classes.length >= 4) {
        return res.status(400).json({
          message: "Teacher already has 4 classes assigned"
        });
    }
    if (!teacher.subjects.includes(subject)) {
      return res.status(400).json({
        message: "Teacher does not teach this subject"
      });
    }
    const conflict = classDoc.subjectTeachers.find(
      (st) => st.subject === subject
    );
    if (conflict) {
      return res.status(400).json({
        message: "This subject already has a teacher in that class"
      });
    }
    teacher.classes.push(classDoc._id);
    classDoc.subjectTeachers.push({ subject, teacher: teacher._id });
    subjectDoc.teacher.addToSet(teacher._id);
    await Promise.all([
      teacher.save(),
      classDoc.save(),
      subjectDoc.save()
    ]);

    return res.status(200).json({
      message: "Teacher assigned successfully",
      teacher,
      class: classDoc,
      subject: subjectDoc
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const fetchAllTeachers = async (req, res) => {
  try {
    const teacherData = await Teacher
      .find({})
      .populate("userId", "name email");    
    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teacherData
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
