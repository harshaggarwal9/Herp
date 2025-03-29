import  jwt from "jsonwebtoken";
export const generateToken = (userId,role,res)=>{
  try{
    const token = jwt.sign({
      userId:userId,
      role:role,

    },process.env.JWT_SEC)
    res.cookie("jwt",token)
    return token
  }
  catch{
    console.log("error in creating token");
  }
}