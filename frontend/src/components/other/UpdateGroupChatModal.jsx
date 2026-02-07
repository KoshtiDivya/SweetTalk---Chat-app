import { ViewIcon } from "@chakra-ui/icons";
import {
    Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
  import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const { user, setSelectedChat, selectedChat } = ChatState();
    const toast = useToast();

   const handleAddUser = async (user1) => {
     if (selectedChat.users.find((u) => u._id === user1._id)) {
       toast({
         title: "User already in the Group!",
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "top-right"
       });

       return;
     }
   
     if (selectedChat.groupAdmin._id !== user._id) {
       toast({
         title: "Only Admin can add someone!",
         status: "error",
          duration: 5000,
         isClosable: true,
         position: "top-right"        
       })

       return;
     }
     try {
       setLoading(true);
       const config = {
         headers: {
           Authorization: `Bearer ${user.token}`
         },
       };
       const { data } = await axios.put('/api/chat/group-add', {
         chatId: selectedChat._id,
         userId: user1._id
       }, config);
       setSelectedChat(data);
       setLoading(false);
       setFetchAgain(!fetchAgain);

     } catch (error) {
       console.log("ADD USER ERROR 👉", error.response?.data || error.message);

  toast({
    title: "Error Occurred!",
    description: error.response?.data?.message || "Server error",
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "top-right",
  });

  setLoading(false);
     }
   }
    const handleRemove = async (user1) => {
     
       if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
       toast({
         title: "Only Admin can remove someone!",
         status: "error",
          duration: 5000,
         isClosable: true,
         position: "top-right"        
       })

       return;
     }
      try {
        setLoading(true);
        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
        const { data } = await axios.put('/api/chat/group-remove', {
          userId: user1._id,
          chatId : selectedChat._id,
        }, config);
        
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      
      } catch (error) {
        toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
        });
        setLoading(false)
      }
    }
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      
      const { data } = await axios.put('/api/chat/rename', {
        chatId: selectedChat._id,
        chatName: groupChatName,
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      setRenameLoading(false);
      setGroupChatName("");
    }

  } 
  
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            fontSize="40px"
            display="flex"
            justifyContent="center"
                  >{selectedChat.chatName }</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
                      <Box w="100%" display={"flex"} flexWrap={"wrap"} pb={3}>
                          {selectedChat.users.map(u => (
                              <UserBadgeItem
                                  key={user._id}
                                  user={u}
                                  handleFunction={() => handleRemove(u)}
                              />
                          ))}
            </Box>
            <FormControl display={"flex"}>
              <Input placeholder="Chat Name"
                mb={3}
                
                onChange={(e) => setGroupChatName(e.target.value)}
              bg="white"/>
              
              <Button
                variant={"solid"}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                bg={"blue.200"}
                outline={"none"}
              >
                Update
              </Button>
            
            </FormControl>
            <FormControl>
                <Input
                placeholder="Add user to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
             {loading ? (
                         <Spinner size="lg"/>
                        ) : (
                          searchResult
                            ?.slice(0, 4)
                            .map((user) => (
                              <UserListItem
                                key={user._index}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                              />
                            ))
                        )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
