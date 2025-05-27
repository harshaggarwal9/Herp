import feesModel from "../models/fees.model.js";
import Parent from "../models/parent.model.js";
import User from "../models/userModel.js";
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
    // 1) Assuming you have JWT auth that populates req.user._id
    const parentId = req.user._id;
    // 2) Load parent and their children array
    const parent = await Parent.findOne({userId:parentId});
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }
    // 3) Find all fees for those student IDs that are still pending
    const pendingFees = await feesModel.find({
      student: { $in: parent.childrens },
      status: "Pending"
    })
    .populate("student", "RollNumber userId")   // pull in roll + name if you need
    .sort({ dueDate: 1 });

    return res.status(200).json(pendingFees);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};