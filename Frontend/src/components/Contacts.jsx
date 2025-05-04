import React, { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import loader from "../assets/loader.gif";

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [menu, setMenu] = useState(true);

  let userContact = contacts.data;

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  return (
    <>
      <div className={`contact-container ${menu ? "active" : ""}`}>
        <div className="brand">
          <img src={logo} alt="logo" />
          <h3>Chat Plus</h3>
          <br />
          <p>-Jatin Poriya</p>
          <i
            onClick={() => {
              setMenu(!menu);
            }}
            className="fa-solid fa-bars"></i>
        </div>
        <div className="contacts">
          {userContact && Array.isArray(userContact) ? (
            userContact.map((contact, index) => (
              <div
                className={`contact ${
                  currentSelected === index ? "selected" : ""
                }`}
                onClick={() => {
                  setCurrentSelected(index);
                  changeChat(contact);
                  setMenu(false);
                }}
                key={index}>
                <div
                  className="avatar"
                  dangerouslySetInnerHTML={{
                    __html: contact.avatarImage,
                  }}></div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))
          ) : (
            <div className="contact-loader">
              <img src={loader} alt="Loader" />
              <p>Loading Contacts...</p>
            </div>
          )}
        </div>
        <div className="current-user">
          <div
            className="avatar"
            dangerouslySetInnerHTML={{
              __html: currentUserImage,
            }}></div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
