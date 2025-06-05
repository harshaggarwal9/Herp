import classModel from "../models/class.model.js";
import feesModel from "../models/fees.model.js";
import User from "../models/userModel.js";

// GET /api/admin/pending-users
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/approve-user
export const approveUser = async (req, res) => {
  const { userId, action } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "approve") {
      user.isApproved = true;
      await user.save();
      return res.status(200).json({ message: "User approved" });
    } else if (action === "reject") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User rejected and deleted" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const totalUser = async(req,res)=>{
  try {
    const count = await User.countDocuments({ isApproved: true });
    res.status(200).json({count});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'internal server error'})
  }
}
export const totalClasses = async(req,res)=>{
  try {
    const count = await classModel.countDocuments();
    res.status(200).json({count});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'internal server error'})
  }
}
export const totalfeescollected = async(req,res)=>{
  try {
    const count = await feesModel.find({status:"Paid"});
    let ans =0;
    count.map(c=>{
      ans+=c.amount;
    }) 
    res.status(200).json({ans});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'internal server error'})
  }
}
export const totalPendingUsers = async(req,res)=>{
  try {
    const count = await User.countDocuments({ isApproved: false });
    res.status(200).json({count});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'internal server error'})
  }
}