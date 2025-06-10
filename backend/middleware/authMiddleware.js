import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SEC);
    } catch (verifyErr) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

