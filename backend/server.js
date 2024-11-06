const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')


const app=express();
app.use(express.json())
app.use(cors())
require('dotenv').config()
const server=app.listen(8080)


const mongouri=process.env.mongo_uri
mongoose.connection.on('connected',()=> console.log("Connected"))
mongoose.connect(mongouri)

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:5173"
    }
})

io.on("connection",(socket)=>{
    console.log("Connnected to Socket.io")
    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })
    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("User joined in the room "+room)
    })

    // Typing functionality
    // socket.on("typing",(room)=>
    //     {
    //         socket.in(room).emit("typing")});

    // socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.users) return;
       
        chat.users.forEach(user=>{
            if(user._id==newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received",newMessageReceived);
        })
        
    })

    
})

const userRoute=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoutes')

app.use('/api/user',userRoute)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)