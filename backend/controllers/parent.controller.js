import Parent from "../models/parent.model.js";
import studentModel from "../models/student.model.js";
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
        const user = await Parent.findById(id).populate([
          { path: "userId" },
        ]);
      if(!user) res.status(404).json({success:false,message:"parent not found"});
      res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server errror" });
  }
}
