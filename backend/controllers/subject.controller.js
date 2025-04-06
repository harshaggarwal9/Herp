import Subject from "../models/subject.model.js";
import classModel from "../models/class.model.js";
import Teacher from "../models/teacher.model.js";
export const createSubject = async (req, res) => {
  const { name, classes } = req.body;

  try {
    const classDocs = await classModel.find({ className: { $in: classes } });

    if (classDocs.length === 0) {
      return res.status(404).json({ message: "No classes found with provided names" });
    }
    const classIds = classDocs.map(cls => cls._id);
    const subject = await Subject.create({
      name,
      classes:classIds,
    });
    await Promise.all(
      classIds.map(classId =>
        classModel.findByIdAndUpdate(
          classId,
          { $addToSet: { subjects: subject._id } }, 
          { new: true }
        )
      )
    );

    res.status(201).json({
      message: "Subject created and added to classes successfully",
      subject,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const assignSubject = async(req,res)=>{
  const {id}=req.params;
  const {subject}=req.body;
  try {
    const user = await Teacher.findById(id);
    if(!user) return res.status(404).json({message:"User not found"});
    const subjects = await Subject.findOne({name:subject});
    if(!subjects) return res.status(404).json({message:"Subject not found"});
    if(user.subjects.includes(subjects.name)){
      await Teacher.findByIdAndUpdate(
        user._id,
        {
          $addToSet: {
            classes: { $each: subjects.classes } // Add multiple classes, avoiding duplicates
          }
        },
        { new: true }
      );
      await Promise.all(
        subjects.classes.map(async (classId) => {
          await classModel.findByIdAndUpdate(
            classId,
            { $addToSet: { teachers: user._id } },
            { new: true }
          );
        })
      );
      await Subject.findByIdAndUpdate(
        subjects._id,
        {$addToSet: {teacher:user._id}}
      )
      res.json({message:"classes are assigned the teacher and teacher is assigned to the class"});
    }
    else res.status(401).json({success:false,message:"this teacher doesn't teaches this subject"});

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"internal server error"});
  }
}