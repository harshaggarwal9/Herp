import teacher from "../models/teacher.model.js"
import User from "../models/userModel.js";
export const createTeacher = async(req,res)=>{
  const {id}=req.params;
  const {subjects,experience,qualifications}=req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const teacherData = await teacher.create({
      userId: user._id,
      subjects:subjects,
      experience:experience,
      qualification:qualifications,
    })
    res.status(201).json({ message: "Teacher created successfully" ,teacher:teacherData});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const fetchTeacher = async(req,res)=>{
  const {id}=req.params;
  try {
    const user = await teacher.findById(id).populate(
      {path:"userId"}
    )
    if (!user) return res.status(404).json({ message: "Teacher not found"})
    res.json(user);
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
