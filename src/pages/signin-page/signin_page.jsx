import React, { useState } from "react";
import "./signin_page.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function SignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");

  const checkUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });
      setData(response.data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any necessary actions with the email and password here
    checkUser(email, password)
      .then((data) => {
        console.log(data.message);
        if (data.authenticated) {
          dispatch({ type: "SET_USERID", payload: data.id });
          dispatch({ type: "SET_USER_EMAIL", payload: email });
          navigate("/");
        } else {
          setEmail("");
          setPassword("");
          alert('Invalid email or password');
        }
      })
      .catch((error) => {
        alert("Server ERROR!");
        console.error(error);
      });
  };

  return (
    <div className="lp-main-div">
      <div className="lg-inner-con">
        <div className="lg-heading">Welcome to</div>
        <div className="lg-heading2">Travel Companion</div>
        <div className="lg-subheading">Sign in your account</div>
        <div className="lg-input-div">
          <form onSubmit={handleSubmit}>
            <div className="lg-input">
              <input
                type="email"
                value={email}
                className="input"
                onChange={handleEmailChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="lg-input">
              <input
                className="input"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                required
              />
            </div>
            <div className="lg-input">
              <button className="lp-btn" type="submit">
                Sign in
              </button>
            </div>
          </form>
        </div>
        <div style={{paddingTop:50,}}>Don't have an account yet? <Link to='/signup'>Signup</Link></div>
      </div>
    </div>
  );
}

export default SignInPage;
