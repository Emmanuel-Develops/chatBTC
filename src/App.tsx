import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Box, Container, Flex, Heading, Image, Text, Textarea } from '@chakra-ui/react'
// import BitcoinIcon from "./assets/bitcoin.svg"
import { BitcoinIcon } from './chakra/custom-chakra-icons'

function App() {

  return (
    <>
      <Container display="flex" flexDir="column" alignItems="stretch" justifyContent="space-between" maxW={"1280px"} minH="100%" h="100%" p={4} centerContent>
        <Flex gap={2} alignItems="center" mt="10%" justifyContent="center">
          <Heading as="h1" size="4xl">
            Chat
          </Heading>
          {/* <Image className='bitcoin-icon' boxSize="75px" src={BitcoinIcon} /> */}
          <BitcoinIcon fontSize="7xl" color="orange.400" />
        </Flex>
        <Box id='main' width="full" mt="100px">
          <Box w="full" h="400px" bgColor="gray.800" ></Box>
          <form>
            <Textarea name="" id="" rows={4} resize="none" ></Textarea>
          </form>
        </Box>
      </Container>
    </>
  )
}

export default App
