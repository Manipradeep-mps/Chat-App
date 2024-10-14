const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')


const app=express();
app.use(express.json())
app.use(cors())
require('dotenv').config()
app.listen(8080)

const mongouri=process.env.mongo_uri
mongoose.connection.on('connected',()=> console.log("Connected"))
mongoose.connect(mongouri)

const userRoute=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')

app.use('/api/user',userRoute)
app.use('/api/chat',chatRoutes)
