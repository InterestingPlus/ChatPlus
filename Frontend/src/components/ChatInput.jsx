import React, { useState } from "react";
import Picker from "emoji-picker-react";

const ChatInput = ({ handleSendMsg }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  const handleEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };
  const sendChat = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="chat-input-container">
      <div className="btn-container">
        <div className="emoji">
          <i className="fa-solid fa-face-smile" onClick={handleEmoji}></i>

          {showEmoji && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type your Message here"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button type="submit" className="send-btn">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
