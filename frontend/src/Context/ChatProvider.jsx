import { useEffect } from "react";
import { useState, useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const ChatContext = createContext();

const ChatProvider = (props) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/"); // Redirect to home page if not logged in
    }
  }, [navigate]);

 

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // useEffect(() => {
  //   if (!user) return;
  //   socket.on("notification received", (newNotify) => {
  //     setNotification((prev) => {
  //       //Avoid notification from same chat
  //       const alreadyExists = prev.find(
  //         (n) => n.chat._id === newNotify.chat._id,
  //       );
  //       if (alreadyExists) return;

  //       return [newNotify, ...prev];
  //     });
  //   });
  //   return () => {
  //     socket.off("notification received");
  //   };
  // }, [user]);

  const fetchNotifications = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/notification", config);
      console.log("Notification API Data:", data);
      setNotification(data);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    fetchNotifications,
  };
  return (
    <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
