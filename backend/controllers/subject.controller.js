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
// export const assignSubjectClassesToTeacher = async (req, res) => {
//   const { id } = req.params; 
//   const { subject } = req.body; 
//   try {
//     const teacherDoc = await Teacher.findById(id);
//     if (!teacherDoc)
//       return res.status(404).json({ message: "Teacher not found" });
//     if (!teacherDoc.subjects.includes(subject)) {
//       return res
//         .status(400)
//         .json({ message: "Teacher does not teach this subject" });
//     }
//     const subjectDoc = await Subject.findOne({ name: subject });
//     if (!subjectDoc)
//       return res.status(404).json({ message: "Subject not found" });
//     const subjectClasses = subjectDoc.classes; 
//     const otherTeachers = await Teacher.find({
//       subjects: subject,
//       _id: { $ne: teacherDoc._id }
//     });
//     let alreadyAssignedClasses = [];
//     otherTeachers.forEach(t => {
//       t.classes.forEach(c => {
//         if (
//           subjectClasses
//             .map(s => s.toString())
//             .includes(c.toString())
//         ) {
//           alreadyAssignedClasses.push(c.toString());
//         }
//       });
//     });
//     alreadyAssignedClasses = Array.from(new Set(alreadyAssignedClasses));
//     const availableSubjectClasses = subjectClasses.filter(
//       c => !alreadyAssignedClasses.includes(c.toString())
//     );
//     const teacherClassesForSubject = teacherDoc.classes.filter(c =>
//       subjectClasses.map(s => s.toString()).includes(c.toString())
//     );
//     const maxClassesPerSubject = 4;
//     const availableSlots = maxClassesPerSubject - teacherClassesForSubject.length;
//     if (availableSlots <= 0) {
//       return res.status(400).json({
//         message:
//           "Teacher already has the maximum number of classes assigned for this subject. Please assign this subject to another teacher."
//       });
//     }
//     const teacherCurrentClassIds = teacherDoc.classes.map(c => c.toString());
//     const newClasses = availableSubjectClasses.filter(
//       c => !teacherCurrentClassIds.includes(c.toString())
//     );
//     const classesToAdd = newClasses.slice(0, availableSlots);

//     if (classesToAdd.length === 0) {
//       return res.status(400).json({
//         message: "No new classes available for assignment for this subject."
//       });
//     }
//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $addToSet: { classes: { $each: classesToAdd } } },
//       { new: true }
//     )
//     await Promise.all(
//       classesToAdd.map(classId =>
//         classModel.findByIdAndUpdate(
//           classId,
//           { $addToSet: { teachers: teacherDoc._id } },
//           { new: true }
//         )
//       )
//     );
//     await Subject.findByIdAndUpdate(
//       subjectDoc._id,
//       { $addToSet: { teachers: teacherDoc._id } },
//       { new: true }
//     );
//     return res.status(200).json({
//       message: "Subject classes assigned to teacher successfully",
//       teacher: updatedTeacher,
//       subject: subjectDoc
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
