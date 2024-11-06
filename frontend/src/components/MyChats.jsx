import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box, Button, MenuDescendantsProvider, Stack, useToast,Text} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../chatLogic/chatLogics'
import GroupChatModel from './GroupChatModel'
function MyChats({fetchAgain}) {
  const [loggedUser,setLoggedUser]=useState()
  const {user,selectedChat,setSelectedChat , chats,setChats} =ChatState()

  const toast=useToast()
  async function fetchChats(){
    try{
       await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/fetchChats`,{
        method:"GET",
        headers:{
          'Content-Type':'Application/json',
          'Authorization':`Bearer ${user.token}`
        }

       })
       .then(res=> res.json()) 
       .then(data=>{
          setChats(data);
          
       })
       
    }
    catch(err){
    
      toast({
        title:"Some error ",
        status:"error",
        isClosable:true,
        position:"top-right",
        duration:2000
      })

    }
  }
  
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
},[fetchAgain]) 

  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "20px", md: "20px" }}
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      My Chats

      <GroupChatModel>
      <Button
        display="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
      >
        New Group Chat
      </Button>
      </GroupChatModel>
    </Box>
    <Box
       display="flex"
       flexDir="column"
       p={3}
       bg="#F8F8F8"
       w="100%"
       h="100%"
       borderRadius="lg"
       overflow="hidden"
     >
     {chats ? 

     (
     <Stack overflowY="scroll">
       {
          
          chats.map((chat)=>(
            <Box
             onClick={()=>setSelectedChat(chat)}
             cursor="pointer"
             bg={selectedChat=== chat ? "#38B2AC":"#E8E8E8"}
             color={selectedChat===chat? "white":"black"}
             px={3}
             py={2}
             borderRadius="lg"
             key={chat._id}
            >
              <Text>
                {
                  loggedUser && !chat.isGroupChat ? getSender(loggedUser,chat.users): chat.chatName
                }
                </Text> 
            </Box>

          ))
       }

     </Stack>) : (<ChatLoading />)
    }
   
    </Box>
  </Box>
  )
}

export default MyChats
