export const roleMiddleware = (allowedroles)=>(req,res,next)=>{
  if(!req.user){
    return res.status(404).json({success:false,message:"user is invalid"});
  }
  if(allowedroles.includes(req.user.role)){
    next();
  }
  else{
    return res.status(403).json({success:false,message:"you are not authorized to access this"})
  }
}