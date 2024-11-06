import React, { useState } from 'react'
import {useDisclosure} from "@chakra-ui/hooks"
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Toast, useToast } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../context/chatProvider'
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';


function UpdateGroupChatModel({fetchAgain,setFetchAgain,fetchMessages}) {
   const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false);
    const {user, selectedChat ,setSelectedChat }=ChatState();
    const toast=useToast()

    async function handleRemove(user1){
      if(selectedChat.groupAdmin._id!==user.data._id && user1._id!==user.data._id)
      {
        
        toast({
          title:"Only Admins can remove members!",
          status:"warning",
          duration:3000,
          position:"top-right"
        })
        return;
      }
      try{
        setLoading(true)
        await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/removeFromGroup`,{
          method:"PUT",
          body:JSON.stringify({
            chatId:selectedChat._id,
            userId:user1._id

          }),
          headers:{
            'Content-Type':'Application/json',
            'Authorization':`Bearer ${user.token}`
          }
        })
        .then(res=>res.json())
        .then(result=>{
          user1._id === user.data._id ? setSelectedChat():setSelectedChat(result) // if user removed himself/herself from the group 
          // then setselected chat need to empty because he/she don't want that chat anymore
          setFetchAgain(!fetchAgain)
          fetchMessages();
          setLoading(false)
        })


      }
      catch(err){
        setLoading(false)
        toast({
          title:"Something went wrong",
          status:"error",
          duration:3000,
          position:"top-right"
        })
      }


    }
    async function handleRename(){
        if(!groupChatName)
        {
          return
        }
        try{

          setRenameLoading(true)
          await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/renameGroup`,{
            method:"PUT",
            body:JSON.stringify({
              chatId:selectedChat._id,
              chatName:groupChatName
           }),
            headers:{
              'Content-Type':'Application/json',
              'Authorization':`Bearer ${user.token}`
            }
          })
          .then(res=>res.json())
          .then(result=>{
             
             setSelectedChat(result)
             setFetchAgain(!fetchAgain)
             setRenameLoading(false)

             toast({
              title:"Group Renamed",
              status:"success",
              duration:2000,
              position:"top-right"
            })
             
          })

        }
        catch(err){
          toast({
            title:"Group Rename failed",
            status:"error",
            duration:2000,
            position:"top-right"
          })
          setRenameLoading(false)

          

        }

    }
    async function handleSearch(query){
      if(!query)
      {
         return;
      }
       try{
        setLoading(true)
           await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/getusers?search=${query}`,{
            method:"GET",
            headers:{
              'Content-Type':'Application/json',
              'Authorization':`Bearer ${user.token}`
            }
          })
          .then(res=>res.json())
          .then(result=>{
            setSearchResult(result)
            setLoading(false)
          })
          
       }
      catch(err){
        setLoading(false)
            toast({
                title:"Something Went wrong..Try again",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"top-right"

             })
      }
      
    }

    async function handleAddUser(user1) {

      if(selectedChat.users.find((u)=> u._id === user1._id))
      {
         toast({
          title:"User already exists in the group",
          status:"error",
          duration:3000,
          position:"top-right"
         })
         return
      }
   
      if(selectedChat.groupAdmin._id!==user.data._id){
        toast({
          title:"Only admins can add members",
          status:"warning",
          duration:3000,
          position:"top-right"
        })
        return;
      }

      try{
        setLoading(true)
        await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/addToGroup`,{
          method:"PUT",
          body:JSON.stringify({
            chatId:selectedChat._id,
            userId:user1._id

          }),
          headers:{
            'Content-Type':'Application/json',
            'Authorization':`Bearer ${user.token}`
          }
        })
        .then(res=>res.json())
        .then(result=>{
          setSelectedChat(result)
          setFetchAgain(!fetchAgain)
          setLoading(false)
        })

        

      }
      catch(err)
      {
        setLoading(false)
         toast({
          title:"Something went wrong",
          status:"error",
           duration:3000,
          position:"top-right"
         })
      }


      
    }

  return (
    <>
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader
               fontSize="35px"
               display="flex"
               justifyContent="center"
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                 <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                   {selectedChat.users.map((u)=>(
                     <UserBadgeItem key={u._id}
                     user={u}
                     handleFunction={()=> handleRemove(u)}
                     />
                   ))}
                 </Box>
                 <FormControl display="flex">
                        <Input
                          placeholder="Chat Name"
                          mb={3}
                          value={groupChatName}
                          onChange={(e)=> setGroupChatName(e.target.value)}
                        />
                        <Button
                          variant="solid"
                          colorScheme='teal'
                          ml={1}
                          isLoading={renameLoading}
                          onClick={handleRename}
                        >
                         Update
                        </Button>
                 </FormControl>
                 <FormControl>
                   <Input
                      placeholder='Add user to group'
                      mb={1}
                      onChange={(e)=> handleSearch(e.target.value)}
                   />
                 </FormControl>
                 {loading?(<Spinner size="lg"/>):(
                   searchResult.map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=> handleAddUser(user)}/>
                   ))
                 )}
                 
            </ModalBody>
            <ModalFooter>
              <Button onClick={()=>handleRemove(user.data)} colorScheme='red'
              > Leave Group</Button>
            </ModalFooter>
          </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel
