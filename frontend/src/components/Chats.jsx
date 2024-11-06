import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from './SideDrawer'
import MyChats from './MyChats'
import ChatBox from './ChatBox'
import { useNavigate } from 'react-router-dom';

function Chats() {
  const {user} =ChatState()
  const [fetchAgain,setFetchAgain]=useState(false)

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display='flex' justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats  fetchAgain={fetchAgain}/>}
      {user && <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>

      
    </div>
  )
}

export default Chats
