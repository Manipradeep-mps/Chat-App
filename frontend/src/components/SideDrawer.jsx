import { Box, Button, Tooltip ,Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Spinner} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import MyProfile from './MyProfile'
import { useNavigate } from 'react-router-dom'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
// import { getSender } from '../chatLogic/chatLogics'
// import NotificationBadge, { Effect } from 'react-notification-badge'
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'; 

function SideDrawer() {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
   
     const navigate=useNavigate()

    const {user,setSelectedChat , chats,setChats,notification,setNotification} =ChatState()

    const[search,setSearch]=useState("")
    const[searchResult,setsearchResult]=useState([])
    const[loading,setLoading]=useState(false)
    const[loadingChat,setLoadingChat]=useState()

    function logout(){
        localStorage.removeItem("userInfo")
        navigate('/')
        
    }

    async function accessChat(userId){
       try{
         setLoadingChat(true)
         await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/accessChats`,{
          method:"POST",
          body:JSON.stringify({
            userId:userId
          }),
          headers:{
            'Content-Type':'Application/json',
            'Authorization':`Bearer ${user.token}`
          }
        })
        .then(res=>res.json())
        .then(result=>{

          if(!chats.find((c)=> c._id=== result._id))
            {
              setChats([result,...chats]);
            }
         setSelectedChat(result);
          setLoadingChat(false);
          onClose();
        })
        .catch(err=>{
          console.log(err)
          toast({
            title:"Error fetching the Chats",
            status:"error",
            isClosable:true,
            position:"top-right"
          })
        })

       }
       catch(err){
        toast({
          title:"Error fetching the Chats",
          status:"error",
          isClosable:true,
          position:"top-right"
        })

       }

        
    }

    async function searchFuction(){
         if(!search)
         {
             toast({
                title:"Please enter something to Search",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"top-right"

             })
             return;
         }

         try{
           setLoading(true)
           await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/getusers?search=${search}`,{
            method:"GET",
            headers:{
              'Content-Type':'Application/json',
              'Authorization':`Bearer ${user.token}`
            }
          })
          .then(res=>res.json())
          .then(result=>{
            setsearchResult(result)
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

  return (
    <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
     >
        <Tooltip label="Search users to Chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
            <SearchIcon/>
            {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
            <FontAwesomeIcon icon={faMagnifyingGlass} /> */}
            <Text display={{base:"none",md:"flex"}} px="4">
                Search User
            </Text >
          
            </Button>

        </Tooltip>
        <Text fontSize="2xl">
              Chat-App
        </Text>
        <div>
            {/* <Menu>
                <MenuButton p={1}>
                  <NotificationBadge
                     count={notification.length}
                     effect={Effect.SCALE}
                  />
                  <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
                <MenuList pl={2}>
                  {!notification.length && "No New Messages"}
                  { notification.map( (notif)=>(
                    <MenuItem
                     key={notif._id}
                     onClick={()=>{
                      setSelectedChat(notif.chat)
                      setNotification(notification.filter((n)=>n!==notif));
                     }}
                     >
                      {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`
                      :`New Message from ${getSender(user,notif.chat.users)}`}
                    </MenuItem>
                  ))}
                </MenuList>
            </Menu> */}
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size="sm" cursor="pointer" name={user.data.name} src={user.data.pic}/>
                </MenuButton>
                <MenuList>
                    <MyProfile user={user}>
                    <MenuItem>My Profile</MenuItem>
                    </MyProfile>
                    <MenuDivider/>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>

    </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px"></DrawerHeader>
            <DrawerBody>
               <Box display="flex" pb={2}>
                 <Input
                   placeholder='Search by name or Email'
                   mr={2}
                   value={search}
                   onChange={(e)=> setSearch(e.target.value)}
                 />
                <Button onClick={searchFuction} isLoading={loading}>Go</Button>

                </Box>
                {
                    loading ? (
                     <ChatLoading/>
                    ):(
                        searchResult.map(user=>(
                            <UserListItem
                            key={user._id}
                            user={user}
                           
                            handleFunction={()=>accessChat(user._id)}/>
                        ))
                    )
                }
                {loadingChat && <Spinner ml="auto" d="flex" />}
           </DrawerBody>
        </DrawerContent>
       

      </Drawer>
    </>
  )
}

export default SideDrawer
