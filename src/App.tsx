import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
// import BitcoinIcon from "./assets/bitcoin.svg"
import { BitcoinIcon, SendIcon } from "./chakra/custom-chakra-icons";
import BeatLoader from "react-spinners/BeatLoader"

interface Message {
  message: string,
  type: "userMessage" | "apiMessage" | "errorMessage"
}

const bodyConfig = {
  specification_hash: import.meta.env.VITE_SPEC_HASH,
  "config": {
    "MODEL_SUMMARIZE":{
        "provider_id":"openai",
        "model_id":"text-davinci-002",
        "use_cache":true
    },
    "WEBCONTENT":{
        "provider_id":"browserlessapi",
        "use_cache":true,
        "error_as_output":false
    },
    "GOOGLE_CUSTOM_SEARCH":{
        "use_cache":true
    },
    "MODEL_ANSWER_WITH_REFS":{
        "provider_id":"openai",
        "model_id":"text-davinci-002",
        "use_cache":true
    }
  },
  stream: false,
  blocking: true,
};

function App() {
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      "message": "Hi there! How can I help?",
      "type": "apiMessage"
    }
  ]);

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList?.scrollHeight;
    }
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current && textAreaRef.current.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userInput) {
      if(!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      // const textArea = textAreaRef.current
      // if (textArea && textArea.rows < 3) {
      //   textArea.rows += 1
      // }
    }
  };

  const fetchResult = async (query: string) => {
    const response = await fetch(import.meta.env.VITE_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        ...bodyConfig,
        inputs: [
          {
            question: query,
          },
        ],
      }),
    })
    const data = await response.json()
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = userInput.trim()
    if (query === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);
    setUserInput("")

    const errMessage = "Something went wrong. Try again later"
    try {
      const data = await fetchResult(query)
      const answer = data?.run?.results[0][0]?.value?.answer
      if (!answer) throw new Error(errMessage)
      setMessages((prevMessages) => [...prevMessages, { "message": answer, "type": "apiMessage" }]);
    } catch (err: any) {
      setMessages((prevMessages) => [...prevMessages, { "message": err?.message ?? errMessage , "type": "errorMessage" }]);
    }
    setLoading(false);
    // setMessages((prevMessages) => [...prevMessages, { "message": errMessage, "type": "apiMessage" }]);
  }

  return (
    <>
      <Box position="relative" overflow="hidden" w="full" h="full" >
      <Container
        display="flex"
        flexDir="column"
        alignItems="center"
        // justifyContent="space-between"
        maxW={"1280px"}
        // maxH="100%"
        h="100%"
        p={4}
        centerContent
      >
        <Flex gap={2} alignItems="center" mt={{base: 3, md: 8 }} justifyContent="center">
          <Heading as="h1" size={{base: "2xl", md: "3xl"}}>
            ChatBTC
          </Heading>
          <BitcoinIcon fontSize={{base: "4xl", md: "7xl"}} color="orange.400" />
        </Flex>
        <Flex id="main" width="full" h="full" maxW="820px" my={5} flexDir="column" gap="4" >
          <Box ref={messageListRef} w="full" bgColor="gray.900" borderRadius="md" flexBasis="100%" overflow="hidden">
            {messages.length && messages.map((message, index) => {
              return <MessageBox key={index} message={message} />
            })}
            {loading && <MessageLoading />}
          </Box>
          <Box w="100%" maxW="100%">
            <form onSubmit={handleSubmit} >
              <Flex gap={2}>
                <Textarea
                  ref={textAreaRef}
                  name=""
                  id="userInput"
                  rows={1}
                  resize="none"
                  disabled={loading}
                  value={userInput}
                  onChange={handleInputChange}
                  bg="gray.700"
                  flexGrow={1}
                  flexShrink={1}
                  onKeyDown={handleEnter}
                />
                <IconButton
                  isLoading={loading}
                  aria-label="send chat"
                  icon={<SendIcon />}
                  type="submit"
                />
              </Flex>
            </form>
          </Box>
        </Flex>
      </Container>
      </Box>
    </>
  );
}

const messageConfig = {
  "apiMessage": {
    color: null,
    bg: "gray.600",
    text: "ChatBTC",
    headingColor: "orange.400"
  },
  "userMessage": {
    color: null,
    bg: "gray.800",
    text: "You",
    headingColor: "purple.400"
  },
  "errorMessage": {
    color: "red.400",
    bg: "gray.600",
    text: "ChatBTC",
    headingColor: "red.500",
  }
}

const MessageLoading = () => {
  return (
    <Flex flexDir="column" gap={{base: 1, md: 2}} w="100%" bgColor={messageConfig["apiMessage"].bg} py={{base: 3, md: 4}} px={{base: 3, md: 4}}>
      {/* <Box w="100%" bgColor={type === "userMessage" ? "gray.800" : "gray.600"} py="8" px={{base: 3, md: 4}}> */}
      <Heading color={messageConfig["apiMessage"].headingColor} fontSize="sm" fontWeight={600}>
        {messageConfig["apiMessage"].text}
      </Heading>
      <BeatLoader color="white" />
    </Flex>
  )
}

const MessageBox = ({message}: {message: Message}) => {
  const type = message.type
  return (
    <Flex flexDir="column" gap={{base: 1, md: 2}} w="100%" bgColor={messageConfig[type].bg ?? ""} textAlign={type === "userMessage" ? "right" : "left"} py={{base: 3, md: 4}} px={{base: 3, md: 4}}>
      {/* <Box w="100%" bgColor={type === "userMessage" ? "gray.800" : "gray.600"} py="8" px={{base: 3, md: 4}}> */}
      <Heading color={messageConfig[type].headingColor} fontSize="sm" fontWeight={600}>
        {messageConfig[type].text}
      </Heading>
      <Text color={messageConfig[type].color || ""} >{message.message}</Text>
    </Flex>
  )
}

export default App;
