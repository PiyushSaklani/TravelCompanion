import React, { useState, useEffect } from "react";
import "../main-page/main_page.css";
import Menu_Icon from "../../icons/svg/menu_icon";
import Close_Icon from "../../icons/svg/close_icon";
import Image_Slider from "../../components/image_slider/image_slider";
import Trip_Detail from "../../components/floating_trip_detail/trip_detail";
import Floating_Image from "../../components/floating_image/floating_image";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Train_Icon from "../../icons/svg/train_icon";
import Car_Icon from "../../icons/svg/car_icon";
import Bus_Icon from "../../icons/svg/bus_icon";
import Flight_Icon from "../../icons/svg/flight_icon";
import App_Bar from "../../components/appbar/appbar";
import Hotel_Icon from "../../icons/svg/hotel_icon";
import axios from "axios";

function MAIN_PAGE() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userId);
  const [showMenu, setShowMenu] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  const images = useSelector((state) => state.images);
  const destination = useSelector((state) => state.destination);
  const trip_data = useSelector((state) => state.trip_data);
  const [showNotification, setShowNotification] = useState(false);

  const [data, setData] = useState();

  const getList = async (id) => {
    try {
      const response = await axios.post(`http://localhost:8000/get-notify`, {
        id,
      });
      console.log(response.data.data);
      setData(response.data.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteList = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/delete-notify/${id}`
      );
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
    getList(userId);
  };

  useEffect(() => {
    // console.log(userId)
    getList(userId);
  }, []);

  useEffect(() => {
    if (images) {
      setShowDestination(true);
    }
    if (trip_data) {
      setShowExplore(true);
    }
  }, [images, trip_data]);

  function handle_menubtn() {
    setShowMenu(!showMenu);
  }

  const initial_trip_data = useSelector((state) => state.initial_trip_data);

  return (
    <div className="app-outer-main-div">

      {showNotification && (
        <div className="notify">
          {data === undefined
            ? "EMPTY"
            : data.map((list, index) => (
                <div className="notify-inner-div" key={index}>
                  <div className="notify-text">{list.note}</div>
                  <div className="notify-delete" onClick={()=>{deleteList(data[index].notify_id);}}>X</div>
                </div>
              ))}
        </div>
      )}

      <div className="mp-main-div">
        <App_Bar
          onClick={() => {
            setShowNotification(!showNotification);
          }}
        />

        <Image_Slider />

        {/* <div className="main-div-1">
        <Floating_Image />
      </div> */}

        <div className="mp-input-div">
          <Trip_Detail />
        </div>

        {showDestination && (
          <div className="mp-trip-list">
            {[...Array(3)].map((_, i) => (
              <div className="mp-trip-plans" key={i}>
                <div
                  className="mp-destination-img"
                  style={{
                    backgroundImage: `url(${initial_trip_data[i]["image"]})`,
                  }}
                ></div>
                <div className="mp-trip-detail">
                  <div className="mp-trip-detail-1">
                    <div className="trip_title">
                      {initial_trip_data[i]["title"]}
                    </div>
                    <div className="trip_days">
                      {initial_trip_data[i]["days"]} Days
                    </div>
                  </div>
                  <div className="trip_icons">
                    <div
                      id="icons"
                      onClick={() => {
                        window.open(
                          "https://www.google.com/travel/flights",
                          "_blank"
                        );
                      }}
                    >
                      <Flight_Icon />
                    </div>
                    <div
                      id="icons"
                      onClick={() => {
                        window.open("https://www.ixigo.com/trains");
                      }}
                    >
                      <Train_Icon />
                    </div>
                    <div
                      id="icons"
                      onClick={() => {
                        window.open("https://www.makemytrip.com/bus-tickets/");
                      }}
                    >
                      <Bus_Icon />
                    </div>
                    <div
                      id="icons"
                      onClick={() => {
                        window.open("https://www.makemytrip.com/hotels/");
                      }}
                    >
                      <Hotel_Icon />
                    </div>
                  </div>
                  <div className="mp-trip-detail-2">
                    <div>Rs. {initial_trip_data[i]["cost"]}</div>
                    <Link to={`/explore/${i}/${initial_trip_data[i]["days"]}`}>
                      <div>Explore</div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MAIN_PAGE;
