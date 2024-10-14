import {  Container ,Box,Text,TabList,Tab,TabPanels,TabPanel,Tabs} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import React from 'react'
import Login from './Login'
import Signup from './Signup'

function Home() {
  const navigate=useNavigate()
  useEffect(()=>{
    const userInfo =localStorage.getItem("userInfo")

    if(userInfo)
    {
       navigate('/chats')
    }

  },[])
  return (
    <Container>
        <Box bg="white" w="100%" marginTop={5} p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant='soft-rounded' colorScheme='green'>
         <TabList marginBottom="1em">
           <Tab width="50%">Login</Tab>
           <Tab width="50%" >Signup</Tab>
         </TabList>
       <TabPanels>
          <TabPanel>
            <Login/>
          </TabPanel>
         <TabPanel>
            <Signup/>
         </TabPanel>
       </TabPanels>
        </Tabs>

      </Box>
    </Container>
  )
}

export default Home
