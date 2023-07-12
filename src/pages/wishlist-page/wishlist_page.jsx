import React, { useState, useEffect } from "react";
import "../main-page/main_page.css";
import "../wishlist-page/wishlist_page.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import App_Bar from "../../components/appbar/appbar";

function WISHLIST_PAGE() {
  const dispatch = useDispatch();
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

  const deleteList = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/delete-list/${id}`);
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
    getList(userId);
  };
  useEffect(() => {
    getList(userId);
  }, []);

  return (
    <div className="mp-main-div">
      <App_Bar />
      {data == undefined?"EMPTY":data.map((list,index) => (
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
              <div className="btn" onClick={()=>{
                dispatch({ type: "SET_TRIP_DATA", payload:list.json});
                navigate('/view')
              }}>View</div>
              <div className="btn" onClick={()=>{
                deleteList(data[index].list_id)
                }}>Delete</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WISHLIST_PAGE;
