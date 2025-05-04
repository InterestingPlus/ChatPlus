import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.svg";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
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
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        toast.success("Logged in Successfully", toastOptions);

        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (!password) {
      toast.error("Password is Required!", toastOptions);
      return false;
    } else if (!username) {
      toast.error("Username is Required!", toastOptions);
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
          min="3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          min="4"
          required
        />

        <button type="submit" className="rbtn">
          Login
        </button>
        <span>
          Don't have an account ? <Link to="/register">Register</Link>
        </span>
      </form>
      <ToastContainer />
    </section>
  );
};

export default Login;
