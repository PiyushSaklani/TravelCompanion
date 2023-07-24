import React, { useState } from "react";
import "./signup_page.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apassword, setaPassword] = useState("");

  const registerUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/register", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleaPasswordChange = (e) => {
    setaPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === apassword) {
      registerUser(email, password)
        .then((data) => {
          console.log(data.message);
          dispatch({ type: "SET_USERID", payload: data._id });
          dispatch({ type: "SET_USER_EMAIL", payload: email });
          setEmail("");
          setPassword("");
          setaPassword("");
          navigate('/');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Password and confirm password do not match");
    }
    setPassword("");
    setaPassword("");
  };

  return (
    <div className="signup-main-div">
      <div className="signup-inner-con"></div>
      <div className="signup-inner-con">
        <div className="signup-heading">Welcome to</div>
        <div className="signup-heading2">Travel Companion</div>
        <div className="signup-subheading">Create your account</div>
        <div className="signup-input-div">
          <form onSubmit={handleSubmit}>
            <div className="signup-input">
              <input
                type="email"
                value={email}
                className="input"
                onChange={handleEmailChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="signup-input">
              <input
                className="input"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="New Password"
                required
              />
            </div>
            <div className="signup-input">
              <input
                className="input"
                type="password"
                value={apassword}
                onChange={handleaPasswordChange}
                placeholder="Confirm Password"
                required
              />
            </div>
            <div className="signup-input">
              <button className="signup-btn" type="submit">
                Sign up
              </button>
            </div>
          </form>
          <div></div>
        </div>
        <div style={{paddingTop:50,}}>Already a member? <Link to='/signin'>Signin</Link></div>
      </div>
    </div>
  );
}

export default SignUpPage;
