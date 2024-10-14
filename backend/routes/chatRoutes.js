const express=require('express');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const authenticate = require('../middleware/middleware');

const router=express.Router()

router.post('/accessChats',authenticate  ,async (req,res)=>{
     const userId=req.body.userId;
    

     if(!userId)
     {
        res.json("Userid not sent")
        return;
     }

     var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users : {$elemMatch : {$eq : req.user.id}}},
            {users : {$elemMatch : {$eq : req.user.id}}}
        ]
     })
     .populate("users" ,"-password")
     .populate("latestMessage")

     isChat= await User.populate(isChat,{
        path:"latestMessage.sender",
        select :"name pic email"
     })

     if(isChat.length > 0)
     {
         res.json(isChat[0])
     }
     else{
         var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user.id , userId]

         }

         try{
           const createdChat =await Chat.create(chatData)

           const fullChat = await Chat.findOne({_id : createdChat.id}).populate("users" ,"-password")

           res.json(fullChat)
         }
         catch(err){
            res.json("Some error occurred")
         }
     }

})

router.get('/fetchChats',authenticate, async (req,res)=>{
    try{
        const data=await Chat.find({users : {$elemMatch :{$eq : req.user.id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")

        .sort({updatedAt:-1})
        .then(async (result)=>{
            await User.populate(result,{
                path:"latestMessage.sender",
                select :"name pic email"
             })
             res.json(result)

        })

    }
    catch(err){
        console.log(err);
        res.json("Error")
    }
   

})

router.post('/createGroup',authenticate,async (req,res)=>{
    if(!req.body.users || !req.body.name )
    {
        res.json("Please fill out all the fields")
        return;
    }

    var users=JSON.parse(req.body.users) // to parse obj which is sent as JSON.stringify(obj)

    if(users.length < 2)
    {
       return  res.json("More than 2 users are required to create the Group")
    }

    users.push(req.user.id)
    console.log(users)
    try{
        
        const groupChat =await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user.id

        })
       
        

        const fullGroupChat =await Chat.findOne({_id:groupChat.id})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.json(fullGroupChat)
    }
    catch(err){
        res.json(err)
    }


    

})

router.put('/renameGroup',authenticate, async (req,res)=>{
    const {chatId , chatName} =req.body

    const updatedChat= await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true, //to give the updated value
        }

    )
    .populate("users","-password")
        .populate("groupAdmin","-password")

    if(!updatedChat)
    {
        return res.json("Chat not found")
    }
    else{
        res.json(updatedChat)
    }

})

router.put('/addToGroup',authenticate, async(req,res)=>{
    const {chatId,userId} =req.body

    const added= await Chat.findByIdAndUpdate(
        chatId,
        {
            $push : {users:userId}
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
        .populate("groupAdmin","-password")

    if(!added)
    {
        return res.json("Chat not found")
    }
    else
    {
        res.json(added)
    }
    
})

router.put('/removeFromGroup',authenticate,async(req,res)=>{
    const {chatId,userId} =req.body

    const removed= await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull : {users:userId}
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
        .populate("groupAdmin","-password")

    if(!removed)
    {
        return res.json("Chat not found")
    }
    else
    {
        res.json(removed)
    }

})


module.exports=router;