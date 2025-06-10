import classModel from "../models/class.model.js";
import feesModel from "../models/fees.model.js";
import User from "../models/userModel.js";
import { sendTemplateMail } from "../Utils/nodemailer.js";
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const approveUser = async (req, res) => {
  const { userId, action } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (action === "approve") {
      user.isApproved = true;
      await user.save();
      try {
        await sendTemplateMail({
          to: user.email,
          subject: "🎉 Your ERP Account Has Been Approved!",
          templateData: {
            name: user.name,
            portalLink: "https://mjerp.onrender.com/",
            year: new Date().getFullYear(),
          }
        });
      } catch (mailErr) {
        return res
          .status(200)
          .json({ message: "User approved, but email failed to send." });
      }
      return res.status(200).json({ message: "User approved and notified." });

    } 
    else if (action === "reject") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User rejected and deleted." });
    } 
    else {
      return res.status(400).json({ message: "Invalid action." });
    }
  } 
  catch (error) {
    console.error("💥 approveUser server error:", error);
    return res.status(500).json({
      message: "Server error during approval process.",
      error: error.message
    });
  }
};

export const totalUser = async (req, res) => {
  try {
    const count = await User.countDocuments({ isApproved: true });
    res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const totalClasses = async (req, res) => {
  try {
    const count = await classModel.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const totalfeescollected = async (req, res) => {
  try {
    const count = await feesModel.find({ status: "Paid" });
    let ans = 0;
    count.map((c) => {
      ans += c.amount;
    });
    res.status(200).json({ ans });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const totalPendingUsers = async (req, res) => {
  try {
    const count = await User.countDocuments({ isApproved: false });
    res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
