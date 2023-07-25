import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import Bell_Icon from "../../icons/svg/bell_icon";

function App_Bar(props) {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userId);
  const userEmail = useSelector((state) => state.userEmail);
  return (
    <div className="mp-navBar">
      <div className="mp-app-name">Travel Companion</div>
      <div className="mp-nav-items">
        <ul>
          <li
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </li>
          <li
            onClick={() => {
              if (userId) {
                navigate("/wish-list");
              } else {
                navigate("/signin");
              }
            }}
          >
            Your List
          </li>
          {/* <li>Contact Us</li> */}
          <li onClick={props.onClick}><Bell_Icon /></li>
          <li>
            <Popover
              content={
                userEmail? (
                    <Link to='/signin'><button className="sign-out-btn">Sign Out</button></Link>
                ) : (
                  <Link to='/signin'><button className="sign-out-btn">Sign In</button></Link>
                )
              }
              title={userEmail ? `${userEmail}` : null}
              trigger="hover"
            >
              <div className="user-profile"></div>
            </Popover>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App_Bar;
