import React, { useState, useEffect } from "react";
import "../explore-page/explore_page.css";
import Close_Icon from "../../icons/svg/close_icon";
import Menu_Icon from "../../icons/svg/menu_icon";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import loading_gif from "../../images/loading.gif";
import PopUp from "../../components/popup/popup";
import { useNavigate } from "react-router-dom";
import App_Bar from "../../components/appbar/appbar";

function View_Page() {
  const [showPopUp, setShowPopUp] = useState(false);
  const trip_data = useSelector((state) => state.trip_data);
  const [tripData, setTrip_detail] = useState(trip_data);

  const handlePopup = () => {
    setShowPopUp(false);
  };

  return (
    <div className="main-outer-div">
      {showPopUp && (
        <div className="popup-outer-div">
          <div className="popup-iner-div">
            <div className="closebtn" onClick={handlePopup}>
              <Close_Icon />
            </div>
          </div>
          <div className="popupcontent">
            <div className="popupheading">Hello, User</div>
            <div className="popupsubheading">Your vacation plan has been safely stored in the wishlist.</div>
            <div className="popupsubheading">After calculating all the expenses and other details, our team will contact you.</div>
          </div>
        </div>
      )}
      <div className="ep-main-div">
        <App_Bar />
        {/* <div className="ep-div-1">
          <div
            className="ep-main-image"
            style={{
              backgroundImage: `url(${initial_trip_data[0]["image"]})`,
            }}
          ></div>
          <div className="ep-div-1-detail">
            <div className="ep-deal-div"></div>
            <div className="ep-place-title">
              Discover {tripData.destination}'s Charm
            </div>
            <div className="ep-place-new-cost">
            </div>
            {loading ? (
              <img className="loading-gif" src={loading_gif} alt="GIF" />
            ) : (
              <div className="customize-field">
                <input
                  type="text"
                  placeholder="Customise package"
                  value={customizationInput}
                  onChange={handleInputChange}
                />
                <button onClick={handleButtonClick}>Customise</button>
              </div>
            )}
          </div>
        </div> */}
        {tripData["it"].map((day, index) => (
          <div className="trip-div-main-box">
            <div className="trip-div-inner-box" key={index}>
              <h2>{day.day}</h2>
              <div className="inner-detil-div">
                <div className="trip-detail-div">
                  {day.activities.map((activity, index) => (
                    <div>
                      <div className="location-name" key={index}>
                        {activity}
                      </div>
                      <div className="location-description" key={index}>
                        {Array.isArray(day.description[activity]) ? (
                          day.description[activity].map((descriptionLine, index) => (
                            <React.Fragment key={index}>
                              {descriptionLine}
                              <br />
                            </React.Fragment>
                          ))
                        ) : (
                          <React.Fragment>
                            {day.description[activity]}
                            <br />
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="place-img"
                  style={{
                    backgroundImage: `url(${day.image})`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        <div className="include-div">
          <div className="include-inner-div">
            <h2>What's Included</h2>
            <div>
              ✓ Sightseeing as per the itinerary
              <br></br>✓ All Transfers, excursions & sightseeing as per the
              itinerary by ac car
              <br></br>✓ All toll taxes, parking fees, Fuel and driver's
              allowances
              <br></br>✓ Welcome drink on arrival
              <br></br>✓ All Transport & Hotels Related Taxes
            </div>
          </div>
        </div>
        {/* <button
          className="confirm-btn"
          onClick={() => {
            handleSaveList();
          }}
        >
          Book Package
        </button> */}
      </div>
    </div>
  );
}

export default View_Page;
