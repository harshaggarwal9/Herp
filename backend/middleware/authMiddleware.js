import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const authMiddleware = async(req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      res.status(404).json({ success: false, message: "token not provided" });
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    if(!decoded) res.status(404).json({success:false,message:"token is invalid"});
    const user=await User.findById(decoded.userId).select("-password");
    req.user=user;
    next();
  } catch (err) {
    console.log("error in token generation");
  }
};
