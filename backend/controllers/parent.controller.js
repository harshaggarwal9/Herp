import feesModel from "../models/fees.model.js";
import Parent from "../models/parent.model.js";
import User from "../models/userModel.js";
import Student from "../models/student.model.js";
import resultModel from "../models/result.model.js";
import subjectModel from "../models/subject.model.js";
export const createParent = async (req, res) => {
  const { id } = req.params;
  const { phone} = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const parent = await Parent.create({
      phoneNumber: phone,
      userId: user._id,
    });
    const ParentData = parent.populate(
      {path: "userId"},
    );
    res
      .status(200)
      .json({
        success: true,
        message: "parent created successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
};
export const getParent = async(req,res)=>{
     const {id} = req.params;
      try{
        const user = await Parent.findOne({userId:id}).populate([
          { path: "userId" },
          {path : "childrens",
            populate: { path: "userId" },
            
          },
          {path : "childrens",
            populate: {path :"classId"},
          },
        ]);
      if(!user) res.status(404).json({success:false,message:"parent not found"});
      res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
export const fetchParentPendingFees = async (req, res) => {
  try {
    const parentId = req.user._id;
    const parent = await Parent.findOne({userId:parentId});
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }
    const pendingFees = await feesModel.find({
      student: { $in: parent.childrens },
      status: "Pending"
    })
    .populate("student", "RollNumber userId")  
    .sort({ dueDate: 1 });

    return res.status(200).json(pendingFees);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const fetchChildrensSubjects = async(req,res)=>{
  try {
    const {id} = req.body;
    const student = await Student.findById(id);
    const subjects = await subjectModel.find({classes:student.classId});
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log(error);
  }
}
export const fetchChildrenResult = async(req,res)=>{
  const {id}=req.body;
    const student = await Student.findById(id);
    try {
      const result = await resultModel.find({student:student._id}).populate([
        {path:"subject"},
        {path:"exam"},
        {path:"student"},
      ]);
      if(!result) res.status(404).json({message:"no student found with this id"});
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "internal server errror" });
    }
} 