import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../context/chatProvider';
import { Form } from 'react-router-dom';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

function GroupChatModel({children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false)

    const toast=useToast()

    const {user,chats, setChats}=ChatState()


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
    async function handleSubmit(){
       if(!groupChatName || !selectedUsers)
       {
        toast({
          title:"Please fill all the fields",
          status:"warning",
          duration:2000,
          isClosable:true,
          position:"top-right"

       })
       return;
       }
       try{
       await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/createGroup`,{
        method:"POST",
        body: JSON.stringify({
          name: groupChatName,
          users: selectedUsers.map((u) => u._id) // Ensure this is an array of user IDs
      }),
        headers:{
          'Content-Type':'Application/json',
          'Authorization':`Bearer ${user.token}`
        }
      })
      .then(res=>res.json())
      .then(result=>{
        setChats([result, ...chats])
        onClose();
        toast({
          title:"New Group created",
          status:"success",
          duration:2000,
          isClosable:true,
          position:"top-right"
  
       })
        
      })
    }
    catch(err){
      console.log(err)
      toast({
        title:"Something went wrong",
        status:"error",
        duration:2000,
        isClosable:true,
        position:"top-right"

     })
    }

      
    }

    function handleGroup(userToAdd){
      if(selectedUsers.includes(userToAdd))
      {
        toast({
          title:"User already exists in Group",
          status:"warning",
          duration:2000,
          isClosable:true,
          position:"top-right"

       })
       return;
      }

      setSelectedUsers([...selectedUsers,userToAdd])

    }

    function handleDelete(delUser){
       setSelectedUsers(
          selectedUsers.filter((sel)=> sel._id !== delUser._id)
       )

    }
    
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
              fontSize="35px"
              display="flex"
              justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
                 <FormControl>
                    <Input
                      placeholder='Group Name'
                       mb={3}
                       onChange={(e)=> setGroupChatName(e.target.value)}
                    />
                 </FormControl>
                 <FormControl>
                    <Input
                      placeholder='Search for Users... '
                       mb={1}
                       onChange={(e)=> handleSearch(e.target.value)}
                    />
                 </FormControl>
                 <Box w="100%" display="flex" flexWrap="wrap" >
                 {
      
                    selectedUsers.map(u=>(
                      <UserBadgeItem key={u._id}
                       user={u}
                       handleFunction={()=> handleDelete(u)}
                       />
                    ))
                 }
                 </Box>

                 {
                    loading ? (<>Loading...</>):(<>
                       {
                       
                        
                         searchResult?.slice(0,4).map((user=>
                             <UserListItem 
                             key={user._id}
                             user={user}
                             handleFunction={()=> handleGroup(user)}
                             />
                         ))
                       }
                    </>)
                 }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel

