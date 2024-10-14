import React from 'react'
import { ChatState } from '../context/chatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from './SideDrawer'
import MyChats from './MyChats'
import ChatBox from './ChatBox'

function Chats() {
  const {user} =ChatState()

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display='flex' justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats />}
      {user && <ChatBox />}
    </Box>

      
    </div>
  )
}

export default Chats
