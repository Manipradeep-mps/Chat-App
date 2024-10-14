const jwt=require('jsonwebtoken')
const User=require('../models/userModel')

const authenticate=(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1];

    if(!token) 
    {
        res.json("Unauthorised..")
        return;
    }

    jwt.verify(token,process.env.jwt_secret_key,(err,user)=>{
        if(err)
        {
            res.json("Invalid token")
            return;
        }
        req.user=user;
        next();
    })

}

module.exports=authenticate;