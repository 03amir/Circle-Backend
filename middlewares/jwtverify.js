const jwt = require("jsonwebtoken");
require("dotenv").config()
const User = require('../models/userSchema')

const verify = (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
      return  res.status(400).send("you have to login first")
    }

    const token = authorization.replace("Bearer ","");
    jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
if(err){
    return res.status(400).send("You have to log in")
}
 // res.send
 //console.log(payload) basicaly payload contains the the detail for which basis we generated the token and a iat prpoerty ,
 // thats why we have to destruct the payload
 const {_id} = payload;
 User.findById(_id).then((userdata)=>{
     req.user= userdata
     next()
 })

    })

   
}

module.exports=verify