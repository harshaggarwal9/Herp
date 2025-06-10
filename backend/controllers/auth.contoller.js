import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/token.js";
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "all fields are required" });
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ message: "Email not found" });
    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = generateToken(existingUser._id, existingUser.role, res);
    const userWithoutPassword = existingUser.toObject();
    delete userWithoutPassword.password;
    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role)
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      res.status(400).json({ status: false, message: "User already exist" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    const token = generateToken(newUser._id, newUser.role, res);
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    return res.status(200).json({
      success: true,
      message: "signup in successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
};
export const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};
