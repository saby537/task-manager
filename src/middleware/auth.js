const User=require('../models/user')
const jwt=require('jsonwebtoken')

const auth= async (req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer ',"")
    const decoded=jwt.decode(token,process.env.JWT_TOKEN)
    const user=await User.findOne({_id:decoded._id,'tokens.token':token})
    if(!user){
        throw new error()
    }
    req.token=token
    req.user=user
    next()
    }catch(e){
        res.status(401).send("Failed to authenticate!!!")
    }
}
module.exports=auth