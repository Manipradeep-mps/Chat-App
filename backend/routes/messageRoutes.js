const express=require('express');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel')
const authenticate = require('../middleware/middleware');

const router=express.Router()

router.post('/',authenticate, async (req,res)=>{

    const {content,chatId} =req.body;

    if(!content || !chatId){
        return res.json("Invalid data");
    }
   
    var newMessage={
        sender:req.user.id,
        content:content,
        chat:chatId
    }


    try{
     var message=await Message.create(newMessage)
     message= await message.populate("sender","name pic");
     message= await message.populate("chat");
     message= await User.populate(message,{
        path:"chat.users",
        select:"name pic email"

     })

     await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage:message
     })
   

     res.json(message)

    }
    catch(err){
        res.json("Error")

    }

})

router.get('/:chatId', authenticate, async (req,res)=>{
    try{
     const messages=await Message.find({chat:req.params.chatId}).populate(
        "sender",
        "name pic email"
     )
     .populate("chat");
     res.json(messages);


    }
    catch(err){
        res.json("Error")
    }

})

module.exports=router;