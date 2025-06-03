import classModel from "../models/class.model.js";
import studentModel from "../models/student.model.js";
import subjectModel from "../models/subject.model.js";
import Teacher from "../models/teacher.model.js";
import TimetableSlot from "../models/timetable.model.js";

// Admin: create a new timetable slot
export const createSlot = async (req, res) => {
  try {
    const { id: teacherId } = req.params;
    const { classId, subject, day, startTime, endTime } = req.body;
    // Basic validation
    if (!teacherId || !classId || !subject || !day || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const teacher = await Teacher.findById(teacherId);
    console.log(teacher);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const classDoc = await classModel.findById(classId);
    if (!classDoc) return res.status(404).json({ message: "Class not found" });

    const subjectDoc = await subjectModel.findOne({ name: subject });
    if (!subjectDoc)
      return res.status(404).json({ message: "Subject not found" });
    // Create the slot
    const slot = await TimetableSlot.create({
      teacher: teacher._id,
      class: classDoc._id,
      subject: subjectDoc._id,
      day,
      startTime,
      endTime,
    });

    return res.status(201).json(slot);
  } catch (err) {
    // Duplicate key error: slot already exists for that class/day/startTime
    if (err.code === 11000) {
      return res.status(400).json({
        message:
          "A slot for that class at the given day and time already exists",
      });
    }
    console.error("createSlot error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Teacher: get all slots assigned to this teacher
export const getSlotsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacherDoc = await Teacher.findOne({ userId: teacherId });
    const { day } = req.body;
    const slots = await TimetableSlot.find({ teacher: teacherDoc._id, day })
      .populate({
        path: "class",
        select: "className section",
      })
      .populate({
        path: "subject",
        select: "name",
      })
      .sort({ day: 1, startTime: 1 })
      .lean();
    return res.status(200).json(slots);
  } catch (err) {
    console.error("getSlotsByTeacher error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Student: get all slots for a given class
export const getSlotsByClass = async (req, res) => {
  try {
    const id = req.user._id;
    const { day } = req.body;
    const student = await studentModel.findOne({ userId: id });
    const slots = await TimetableSlot.find({ class: student.classId, day })
      .populate({
        path: "teacher",
        populate: {
          path: "userId",
          select: "name", 
        },
      })

      .populate("subject", "name")
      .sort({ day: 1, startTime: 1 })
      .lean();

    return res.status(200).json(slots);
  } catch (err) {
    console.error("getSlotsByClass error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
