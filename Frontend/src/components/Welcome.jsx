import React, { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";

const Welcome = ({ user }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);

  useEffect(() => {
    if (user) {
      setCurrentUserName(user.username);
    }
  }, [user]);

  return (
    <div className="welcome-container">
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{currentUserName}</span>!
      </h1>
      <h3>Please Select chat to Start Messaging.</h3>
    </div>
  );
};

export default Welcome;
