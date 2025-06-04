import Subject from "../models/subject.model.js";
import classModel from "../models/class.model.js";
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
