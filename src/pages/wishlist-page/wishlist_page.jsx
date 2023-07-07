import React, { useState, useEffect } from "react";
import "../main-page/main_page.css";
import "../wishlist-page/wishlist_page.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function WISHLIST_PAGE() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const userId = useSelector((state) => state.userId);

  const getList = async (id) => {
    try {
      const response = await axios.post("http://localhost:8000/get-list", {
        id,
      });
      setData(response.data.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    getList(userId);
  }, []);

  return (
    <div className="mp-main-div">
      <div className="mp-navBar">
        <div className="mp-app-name">Travel</div>
        <div className="mp-nav-items">
          <ul>
            <li
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </li>
            <li>Wish List</li>
            <li>Explore</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
      {data.map((list) => (
        <div className="list-main-div">
          <div className="list-container">
            <div
              className="list-image"
              style={{
                backgroundImage: `url(${list.json.it[0].image})`,
              }}
            ></div>
            <div className="list-content">
              <div className="list-heading">
                Vaccation to {list.destination}
              </div>
              <div className="list-days">{list.json.num_days} Days</div>
            </div>
            <div className="list-btn">
              <div className="btn">View</div>
              <div className="btn">Delete</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WISHLIST_PAGE;
