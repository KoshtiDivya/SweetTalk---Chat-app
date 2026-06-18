import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const ProfileModal = ({user, children, isOwnProfile = false }) => {
  const { setUser } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [pic, setPic] = useState(user?.pic || "");
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setPreview(URL.createObjectURL(file));
  postDetails(file);
  };
  
  const postDetails = (file) => {
  if (!file) return;

  const data = new FormData();

  data.append("file", file);
  data.append("upload_preset", "sweetTalk - chatApp");
  data.append("cloud_name", "divyakoshti");

  fetch(
    "https://api.cloudinary.com/v1_1/divyakoshti/image/upload",
    {
      method: "POST",
      body: data,
    }
  )
    .then((res) => res.json())
    .then((data) => {
      setPic(data.secure_url);
    })
    .catch((err) => console.log(err));
};

const updateProfile = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

        const { data } = await axios.put(
      "/api/user/profile",
      {
        name,
        pic,
      },
      config
    );
    
    const updatedUser = {
      ...data,
      token: user.token,
    };
    
    localStorage.setItem(
      "userInfo",
      JSON.stringify(updatedUser)
    );
    
    setUser(updatedUser);
    
    setIsEditing(false)
  } catch (error)
  {
    console.log(error);
  }
  };
useEffect(() => {
  if (user) {
    setName(user.name);
    setPic(user.pic);
  }
}, [user, isOpen]);
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgGradient="linear(to-r, blue.300, purple.100)" h={"410px"}>
          <ModalHeader
            fontFamily="Work sans"
            fontSize="40px"
            display="flex"
            justifyContent="center"
          >
          {isEditing && isOwnProfile ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <Text fontSize="40px" fontFamily="Work sans">
                  {user.name}
                </Text>
              )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={preview || pic}
              alt={user.name}
            />
             {isEditing && isOwnProfile &&(
                  <Input
                    type="file"
                    accept="image/*"
                    p={1.5}
                    onChange={handleImageChange}
                  />
                )}

            
            <Text fontSize={{base:"28px", md:"30px"}} fontFamily="Work sans" pt={1}>
                         Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            {
              isOwnProfile && (
               !isEditing ? (
               <Button
                 colorScheme="blue"
                 onClick={() => setIsEditing(true)}
               >
                 Update
               </Button>
             ) : (
               <Button
                 colorScheme="green"
                 onClick={updateProfile}
               >
                 Save
               </Button>
             )
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
