const express=require('express')
const User=require('./../models/userModel')
const router=express.Router()
const jwt=require('jsonwebtoken')
require('dotenv').config()
const bcrypt=require('bcrypt')
const authenticate=require('../middleware/middleware')

router.post('/register', async (req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const pic=req.body.pic;

    if(!name || !email || !password)
    {
        res.json("Please fill all the Fields")
        return;
    }
    const userexists=await User.findOne({email})
    if(userexists)
    {
        res.json("User already exits")
    }
    else
    {
    const salt=10;
    const hashedpassword=await bcrypt.hash(password,salt)
    const user=await User.create({
        name,
        email,
        password:hashedpassword,
        pic
    })
  
     if(user)
     {
        const obj={
            id:user.id
        }
        const token=jwt.sign(obj,process.env.jwt_secret_key,{expiresIn:"30d"})
        const result={
            "data":user,
            "token":token,
            "msg":"Success"
        }
        res.json(result)
        return;
     }
     else{
        res.json("Error occurred")
     }
    }
})

router.post('/login',async (req,res)=>{
    try{
    const email=req.body.email
    const password=req.body.password

    if(!email || !password)
    {
        res.json("Please fill out all the fields")
        return;
    }
  
    const data=await User.findOne({email})
    if(!data)
    {
        res.json("User does not exists");
    }
    else
    {
        const state= await bcrypt.compare(password,data.password)

        if(state)
        {
            const obj={
                id:data.id
            }
            const token=jwt.sign(obj,process.env.jwt_secret_key,{expiresIn:"30d"})
            const result={
                "data":data,
                "token":token,
                "msg":"Success"
            }
            res.json(result)


        }
        else{
            res.json("Invalid Credentials")
        }
    }
   }
   catch(err){
      console.log(err);
   }
})

router.get('/getusers',authenticate,async (req,res)=>{
     const keyword=req.query.search ?
     {
        $or:[ {name: {$regex:req.query.search , $options :"i"}},
              {email: {$regex:req.query.search , $options:"i"}}
        ]
     } : {}

     //regex is used for pattern matching , i- case insensitive

     const result=await User.find(keyword).find({_id:{$ne:req.user.id}})

     //Here the find(keyword) is used to fetch all uses based on the search and
     // find({_id:{$ne:req.user._id}}) - is used to exclude the currently logged in user

     res.send(result)
})

module.exports=router;