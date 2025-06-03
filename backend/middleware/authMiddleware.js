import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not provided" });
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SEC);
    } catch (verifyErr) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Fetch user from DB and attach to req.user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user; // Now req.user._id is available as decoded.userId
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};