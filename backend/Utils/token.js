import jwt from "jsonwebtoken";
export const generateToken = (userId, role, res) => {
  try {
    const token = jwt.sign(
      {
        userId: userId,
        role: role,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      // secure: true // in production
    });

    return token;
  } catch {
    console.log("error in creating token");
  }
};