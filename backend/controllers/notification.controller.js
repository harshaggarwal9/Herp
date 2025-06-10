import Notification from "../models/notification.model.js"
export const postNotification = async(req,res)=>{
  try {
    const io = req.app.get('io');
    const {title,message,targetRoles} = req.body;
    const sender = req.user._id;
    const notif = await Notification.create(({ sender, title, message, targetRoles }));
    io.emit('notification', {
      _id: notif._id,
      sender,
      title,
      message,
      targetRoles,
      createdAt: notif.createdAt
    });

    return res.status(201).json(notif);

  } catch (error) {
    console.log(error);
    res.status(400).json({success:false , message:"Internal server error"});
  }
}
export const getNotification = async(req,res)=>{
  try {
     const role = req.user.role;
    const notifs = await Notification.find({ targetRoles: role })
      .sort('-createdAt')
      .lean();
    return res.status(200).json(notifs);
  } catch (error) {
    console.log(error);
    res.status(400).json({success:false , message:"Internal server error"});
  }
}