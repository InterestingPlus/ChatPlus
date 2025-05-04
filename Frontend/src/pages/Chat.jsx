import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsersRoute, host } from "../utils/APIRoutes";

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    async function localUser() {
      try {
        setCurrentUser("");
        if (!localStorage.getItem("chat-app-user")) {
          navigate("/register");
        } else {
          setCurrentUser(
            await JSON.parse(localStorage.getItem("chat-app-user"))
          );
        }
      } catch (err) {
        toast.error(err, toastOptions);
      }
    }
    localUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        setContacts(await axios.get(`${allUsersRoute}/${currentUser._id}`));
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            setContacts(await axios.get(`${allUsersRoute}/${currentUser._id}`));
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (err) {
        toast.error(err, toastOptions);
      }
    }
    fetchData();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="chat-container">
      <div className="inner-container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome user={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chat;
