import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'


function Signup() {
    const navigate=useNavigate()
    const chakra_toast=useToast()
    const [show,setShow]=useState(false)
     
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [cpassword,setCpassword]=useState()
    const [pic,setPic]=useState()
    const [loading,setLoading]=useState(false)

    function invert(){
        setShow(!show)
    }

    function postDetails(pics){
      setLoading(true)
      if(pics== undefined)
      {
        setLoading(false)
        toast.warning("Please select an image",{
          position:"top-right",
          autoClose:3000,
        })
       
        return;

      }

      if(pics.type==="image/jpeg" || pics.type==="image/png")
      {
        const data=new FormData()
        data.append("file",pics)
        data.append("upload_preset","Chat-App")
        data.append("cloud_name","drm6nxrz2")

        

        fetch("https://api.cloudinary.com/v1_1/drm6nxrz2/image/upload",{
          method:'POST',
          body:data
        })
        .then(res=> res.json())
        .then(result=>{
          setPic(result.url.toString())
           setLoading(false)
           if(result.url.toString())
           {
             toast.success("Image uploaded Successfully",{
                position:"top-right",
                autoClose:2000
             })
           }
        })
        .catch(err=>{
          setLoading(false)
          toast.warning("Failed to upload image.Try again!!",{
            position:"top-right",
            autoClose:3000,
          })

          
        })

      }
      else
      {
        setLoading(false)
        toast.warning("Please select an image file",{
          position:"top-right",
          autoClose:3000,
        })
      }

    }

    async function submit(){
      
      setLoading(true)

      if(!name || !email || !password ||!cpassword)
      {
        chakra_toast({
          title:"Please fill out all the fields",
          status:"warning",
          position:"top-right",
          duration:2000,
          isClosable:true

        })
        setLoading(false)
        return ;
      }
      if(password !== cpassword)
      {
        chakra_toast({
          title:"Password and Confirm password doesn't match",
          status:"warning",
          position:"top-right",
          duration:2000,
          isClosable:true

        })
        setLoading(false)
        return ;
      }

      try{

        const obj={
          name,
          email,
          password,
          pic
        }
        await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/register`,{
          method:'POST',
          body:JSON.stringify(obj),
          headers:{
            'Content-Type':'Application/json'
          }

        })
        .then(res=>res.json())
        .then(data=>{
          setLoading(false)
          if(data.msg)
          {
            localStorage.setItem('userInfo',JSON.stringify(data))
             chakra_toast({
                 title:"Registeration Successfull !!",
                 position:"top-right",
                 status:"success",
                 isClosable:true,
                 duration:2000,
                 onCloseComplete:()=>{
                    navigate('/chats')
                 }
             })
         }
        })
         .catch(err=>{
          console.log(err)
         })

      }
      catch(err)
      {
        chakra_toast({
          title:"Something went wrong ! Please try again",
          status:"warning",
          position:"top-right",
          duration:2000,
          isClosable:true

        })
        setLoading(false)

      }

      
        
    }

  return (
    <>
    <VStack spacing="3px" color="black">
        <FormControl id='name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder='Enter your Name'
              onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder='Enter your Email'
              onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
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

        <FormControl id='cpassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder='Confirm password'
              onChange={(e)=>setCpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
               <Button height="1.75rem" size="sm" onClick={invert}>
                {show ? "Hide" :"Show"}
               </Button>
            </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <FormControl id='pic' >
            <FormLabel>Profile Picture</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={e=> postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button colorScheme='blue' width="100%" marginTop="15" onClick={submit} isLoading={loading}>Signup</Button>

    </VStack>
    <ToastContainer/>
    </>
  )
}

export default Signup
