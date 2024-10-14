import React from 'react'
import { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'

import {useNavigate} from 'react-router-dom'
import { useToast } from '@chakra-ui/react'


function Login() {
    const toast=useToast()
    const navigate=useNavigate()
    const [show,setShow]=useState(false)
     
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [loading,setLoading]=useState()
    
    function invert(){
        setShow(!show)
    }


    async function submit(){
      const obj={
        "email":email,
        "password":password
      }

      await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/login`,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
          'Content-Type':'Application/json'
        }
      })
      .then(res=> res.json())
      .then(data=>{
        if(data.msg)
        {
          localStorage.setItem('userInfo',JSON.stringify(data))
          toast({
            title:"Login Successful !!",
            status:"success",
            position:"top-right",
            duration:2000,
            isClosable:true,
            onCloseComplete:()=>{
              navigate('/chats')
            }

          })
        }
        else
        {
         if(data === "Invalid Credentials")
          {
            toast({
              title:"Invalid Credentials",
              status:"error",
              position:"top-right",
              duration:2000,
              isClosable:true

            })
          }
          else
          {
            toast({
              title:`${data}`,
              status:"warning",
              position:"top-right",
              duration:2000,
              isClosable:true

            })
        }
        }
      })
      .catch(err=>{
        console.log(err)
      })

        
    }

  return (
    <>
    <VStack spacing="3px" color="black">
       
        <FormControl id='email1' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder='Enter your Email'
              onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password1' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder='Enter your Password'
              onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
               <Button height="1.75rem" size="sm" onClick={invert}>
                {show ? "Hide" :"Show"}
               </Button>
            </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <Button colorScheme='blue' width="100%" marginTop="15" onClick={submit}>Login</Button>

    </VStack>
    </>
  )
}

export default Login
Login