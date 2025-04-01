import Classes from "../models/class.model.js"
import Student from "../models/student.model.js"
export const createClass = async (req,res)=>{
  const {className,section} = req.body;
  try {
    const student = await Student.findOne({RollNumber})
     const Class = await Classes.create({
          className,
          section,
          $push : student._id,
      });
      res.status(201).json({message: "Class created successfully", Class});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  
  }
}