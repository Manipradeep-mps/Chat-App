import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text,Toast, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../chatLogic/chatLogics';
import MyProfile from './MyProfile';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import "../styles/chatStyles.css"
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animation/typingAnimation.json'

const endpoint=`${import.meta.env.VITE_BASE_URL}`;
var socket,selectedChatCompare;


function SingleChat({fetchAgain,setFetchAgain}) {
  const {user, selectedChat ,setSelectedChat ,notification,setNotification}=ChatState();
    const toast=useToast();
     const[messages,setMessages]=useState([])
      const[loading,setLoading]=useState(false)
      const[newMessage,setNewMessage]=useState([])
      const[socketConnected,setSocketConnected]=useState(false)

      
   
  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
  },[selectedChat])

  useEffect(()=>{
     socket=io(endpoint)
     socket.emit("setup",user.data)
     socket.on("connected",()=>
     {
        setSocketConnected(true)
     })
    //  socket.on('typing',()=>setIsTyping(true))
    //  socket.on('stop typing',()=> setIsTyping(false))
  },[])

  useEffect(()=>{
     socket.on("message received",(newMessageReceived)=>{
       if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id)
       {
          if(!notification.includes(newMessageReceived))
          {
            setNotification([newMessageReceived,...notification]);
            
            setFetchAgain(!fetchAgain);
          }
       }
       else
       {
          setMessages([...messages,newMessageReceived]);
       }
     })
 })

  async function fetchMessages(){
      if(!selectedChat) return;

      try{
        setLoading(true)
        await fetch(`${import.meta.env.VITE_BASE_URL}/api/message/${selectedChat._id}`,{
          method:"GET",
          headers:{
            'Content-Type':'Application/json',
            'Authorization':`Bearer ${user.token}`
          }
        })
        .then(res=>res.json())
        .then(result=>{
          setMessages(result)
          setLoading(false)

          socket.emit('join chat',selectedChat._id);
        })

      }
      catch(err) 
      {
        toast({
          title:"Failed to fetch chats!",
          status:"error",
          duration:3000,
          position:"top-right"
        })
      }
  }


  async function sendMessage(e){
    if(e.key=="Enter" && newMessage)
    {
      // socket.emit("stop typing",selectedChat._id);
      try{
        setNewMessage("")
        await fetch(`${import.meta.env.VITE_BASE_URL}/api/message`,{
          method:"POST",
          body:JSON.stringify({
            content:newMessage,
            chatId:selectedChat._id

          }),
          headers:{
            'Content-Type':'Application/json',
            'Authorization':`Bearer ${user.token}`
          }
        })
        .then(res=>res.json())
        .then(result=>{
          socket.emit("new message",result)
          setMessages([...messages,result])
        })
      }
      catch(err)
      {
           toast({
            title:"Something went wrong",
            status:"error",
            duration:2000,
            position:"top-right"
           })
      }
    }

  }

  function typingHandler(e){
      setNewMessage(e.target.value)
      // if(!socketConnected)
      //   {
          
      //      return;
      //   }
      

      // if(!typing)
      // {
      //   setTyping(true)
      //   socket.emit("typing",selectedChat._id)
      // }

      // let lastTypingTime=new Date().getTime();
      // var timerLength=3000;

      // setTimeout(()=>{
      //   var timeNow=new Date().getTime();
      //   var timeDiff=timeNow -  lastTypingTime;

      //   if(timeDiff >= timerLength && typing)
      //   {
      //     socket.emit("stop typing",selectedChat._id)
      //     setTyping(false)
      //   }
      // },timerLength)
  }
  return (
    <>
      {
        selectedChat ? (<>
             <Text
               fontSize={{base: "28px" , md : "30px"}}
               pb={3}
               px={2}
               w="100%"
               display="flex"
               justifyContent={{base:"space-between"}}
               alignItems="center"
             >
                <IconButton
                  display={{base:"flex",md:"none"}}
                  icon={<ArrowBackIcon/>}
                  onClick={()=> setSelectedChat("")}
                />
                {
                  !selectedChat.isGroupChat?(
                    <>
                    {getSender(user,selectedChat.users)}

                   
                    <MyProfile user={getSenderFull(user,selectedChat.users)}/>
                    </>
                  ):(
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                     fetchMessages={fetchMessages}/>
                    </>
                  )
                    
                }

             </Text>
             <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflow="hidden"
             >
                {loading ? (<Spinner
                 size="xl"
                 w={20}
                 h={20}
                 alignSelf="center"
                 margin="auto"
                 />):(
                
                  <div className='messages'>
                    <ScrollableChat messages={messages}/>
                  </div>
                )}
             </Box>
             <FormControl onKeyDown={sendMessage} isRequired mt={3}>
             
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              ></Input>

             </FormControl>

        </>):(
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3}>
                    Click a chat to start chating !!
                </Text>


            </Box>
        )
      }
    </>
  )
}

export default SingleChat
