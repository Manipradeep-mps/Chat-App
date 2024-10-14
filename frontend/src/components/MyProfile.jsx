import React, { Children } from 'react'
import { IconButton, useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,ModalFooter,Button, Image,Text} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

function MyProfile({user,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    {
        children ? (<span onClick={onOpen}>{children}</span>) : (
            <IconButton
              display={{base:"flex"}}
              icon={<ViewIcon/>}
              onClick={onOpen}
            />
        )
    }
    <Modal size="sm" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="350px">
          <ModalHeader
             fontSize="20px"
             display="flex"
             justifyContent="center"
          >{user.data.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
             display="flex"
             flexDirection="column"
             alignItems="center"
             justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.data.pic}
              alt={user.data.name}

             />
          </ModalBody>
          <Text fontSize={{base:"18px" , md:"20px"}} paddingLeft="20px">
              Email : {user.data.email}
          </Text>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      
    </>
  )
}

export default MyProfile
