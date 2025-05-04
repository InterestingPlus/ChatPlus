import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.svg";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username, email } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        toast.success("Signed Up Successfully", toastOptions);

        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/setAvatar");
      }
    }
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and Confirm Password should be same!",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be Grater than 3 characters!", toastOptions);
      return false;
    } else if (password.length < 5) {
      toast.error("Password should be Grater than 5 characters!", toastOptions);
      return false;
    } else if (!email) {
      toast.error("Email is Required!", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="reg">
      <form className="register" onSubmit={(e) => handleSubmit(e)}>
        <div className="brand">
          <img src={logo} alt="Logo" />
          <h1>Chat Plus</h1>
        </div>

        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={(e) => handleChange(e)}
          required
        />
        <button type="submit" className="rbtn">
          Create User
        </button>
        <span>
          Already have an account ? <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </section>
  );
};

export default Register;
