import classModel from "../models/class.model.js";
export const createClass = async (req,res)=>{
  const {className,section} = req.body;
  try {
     const Class = await classModel.create({
          className,
          section,
      });
      res.status(201).json({message: "Class created successfully", Class});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  
  }
}
export const fetchClasses = async (req, res) => {
  try {
    const classDocs = await classModel.find({});
    res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      data: classDocs,  
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchClassesbyid = async(req,res)=>{
  const {id} = req.params
  try {
    const classById= await classModel.findById(id)
    res.status(200).json({message: "Class fetched successfully", classById});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
export const deleteClass = async(req,res)=>{
  const {id}=req.params
  try {
    const classById= await classModel.findByIdAndDelete(id)
    res.status(200).json({message: "Class deleted successfully", classById});
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"});
    console.log(error);
  }
}
