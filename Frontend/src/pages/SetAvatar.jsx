import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import loader from "../assets/loader.gif";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Buffer } from "buffer";
import { setAvatarRoute } from "../utils/APIRoutes";

const SetAvatar = () => {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please Select and Avatar to Continue", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(setAvatarRoute, {
        image: avatars[selectedAvatar],
        user,
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error(
          "Error while Setting the Avatar, Please try again",
          toastOptions
        );
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let data = [];

        for (let i = 0; i < 4; i++) {
          const randomAvatarNumber = Math.floor(Math.random() * 100000) + 1;
          const apiUrl = `https://api.multiavatar.com/${randomAvatarNumber}`;

          const response = await axios.get(apiUrl);

          const avatarImage = response.data;
          data.push(avatarImage);
        }

        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Too Many requests! try again Later", toastOptions);
        const navErr = confirm(
          "Try Again Later.. Go to Home without Setting Avatar?"
        );
        if (navErr) {
          navigate("/");
        }
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="avatar-loader">
        <img src={loader} alt="Loader" className="loader" />
      </div>
    );
  } else {
    return (
      <section className="avatar">
        <div className="container">
          <div className="title">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                className={`avatar-image ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                key={index}
                dangerouslySetInnerHTML={{ __html: avatar }}
                onClick={() => setSelectedAvatar(index)}
              />
            ))}
          </div>
        </div>
        <button className="avatar-btn" onClick={setProfilePicture}>
          Set as Profile Picture
        </button>

        <ToastContainer />
      </section>
    );
  }
};

export default SetAvatar;
