import Teacher from "../models/teacher.model.js"
import classModel from "../models/class.model.js";
import Subject from "../models/subject.model.js";
import User from "../models/userModel.js";
export const createTeacher = async(req,res)=>{
  const {id}=req.params;
  console.log(id);
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
export const fetchTeacher = async(req,res)=>{
  const {id}=req.params;
  try {
    const user = await Teacher.findById(id).populate(
      {path:"userId"}
    )
    if (!user) return res.status(404).json({ message: "Teacher not found"})
    res.json(user);
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const assignTeacher = async (req, res) => {
  const { id: teacherId } = req.params;
  const { classId, subject } = req.body;

  try {
    // 1️⃣ Fetch teacher, class, subject
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) 
      return res.status(404).json({ message: "Teacher not found" });

    const classDoc = await classModel.findById(classId);
    if (!classDoc) 
      return res.status(404).json({ message: "Class not found" });

    const subjectDoc = await Subject.findOne({ name: subject });
    if (!subjectDoc) 
      return res.status(404).json({ message: "Subject not found" });

    // 2️⃣ Rule 1: Max 6 classes total
    // 2️⃣ Rule 1: Max 4 classes total
    if (teacher.classes.length >= 4) {
        return res.status(400).json({
          message: "Teacher already has 4 classes assigned"
        });
    }


    // 3️⃣ Rule 2: Subject must be in teacher’s interests
    if (!teacher.subjects.includes(subject)) {
      return res.status(400).json({
        message: "Teacher does not teach this subject"
      });
    }

    // 4️⃣ Rule 3: No other teacher for this subject in this class
    //    We assume classDoc.subjectTeachers = [{ subject, teacher }]
    const conflict = classDoc.subjectTeachers.find(
      (st) => st.subject === subject
    );
    if (conflict) {
      return res.status(400).json({
        message: "This subject already has a teacher in that class"
      });
    }

    // 5️⃣ All checks passed → perform updates atomically
    // Add class to teacher
    teacher.classes.push(classDoc._id);

    // Add this teacher/subject to the class
    classDoc.subjectTeachers.push({ subject, teacher: teacher._id });

    // Add teacher to subject’s teacher list
    subjectDoc.teacher.addToSet(teacher._id);

    // Save all three docs
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
// controllers/teacher.controller.js
export const fetchAllTeachers = async (req, res) => {
  try {
    const teacherData = await Teacher
      .find({})
      .populate("userId", "name email");      // ← populate only name & email
      console.log(teacherData);
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
