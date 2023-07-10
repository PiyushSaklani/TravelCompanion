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

function MAIN_PAGE() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userId);
  const [showMenu, setShowMenu] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  const images = useSelector((state) => state.images);
  const destination = useSelector((state) => state.destination);
  const trip_data = useSelector((state) => state.trip_data);

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
    <div className="mp-main-div">
      <App_Bar />

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
                  <div id="icons"
                  onClick={() => {
                    window.open(
                      "https://www.ixigo.com/trains"
                    );
                  }}>
                    <Train_Icon />
                  </div>
                  <div id="icons"
                  >
                    <Bus_Icon />
                  </div>
                  <div id="icons">
                    <Car_Icon />
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
  );
}

export default MAIN_PAGE;
