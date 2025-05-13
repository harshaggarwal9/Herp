import User from "../models/userModel.js";

// GET /api/admin/pending-users
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });
    res.status(200).json(users);
    console.log(users);
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
