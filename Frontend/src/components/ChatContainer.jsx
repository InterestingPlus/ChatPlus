import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import axios from "axios";
import {
  getMessageRoute,
  setTo,
  getTo,
  sendMessageRoute,
} from "../utils/APIRoutes";
import loader from "../assets/loader.gif";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  const handleSend = async (e) => {
    await axios.post(setTo, {
      user: currentUser._id,
      to: currentChat.username,
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        handleSend();
        const response = await axios.post(getMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });

        setMessages(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    const response = await axios.post(getTo, {
      user: currentChat._id,
    });
    if (response.data.to === currentUser.username) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
    }

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((pre) => [...pre, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div className="chat-message-container">
      <div className="chat-header">
        <div className="user-details">
          <div
            className="avatar"
            dangerouslySetInnerHTML={{
              __html: currentChat.avatarImage,
            }}></div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}>
          Logout
        </button>
      </div>

      <div className="chat-messages">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              ref={scrollRef}
              key={uuidv4()}
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="contact-loader">
            <img src={loader} alt="Loader" />
            <p>Loading Messages...</p>
          </div>
        )}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatContainer;
