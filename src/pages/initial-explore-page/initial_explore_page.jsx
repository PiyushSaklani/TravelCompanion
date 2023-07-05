import React, { useState, useEffect } from "react";
import "../explore-page/explore_page.css";
import Close_Icon from "../../icons/svg/close_icon";
import Menu_Icon from "../../icons/svg/menu_icon";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Initial_Explore_Page() {
  const images = useSelector((state) => state.images);
  const location = useSelector((state) => state.location);
  const duration = useSelector((state) => state.duration);
  const date = useSelector((state) => state.date);
  const adults = useSelector((state) => state.adults);
  const child = useSelector((state) => state.child);
  const trip_data = useSelector((state) => state.trip_data);
  const { id, days, destination } = useParams();
  const initial_trip_data = useSelector((state) => state.initial_trip_data);

  const [tripData, setTrip_data] = useState(null);
  const [tripDetails, setTrip_detail] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  function handle_menubtn() {
    setShowMenu(!showMenu);
  }

  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/initial_details");

        if (response.ok) {
          const data = await response.json();
          setTrip_data(data[destination]["3"]["it"]);
          setTrip_detail(data[destination]["0"])
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError("An error occurred");
      }
    };

    fetchDetails();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tripData) {
    return <div>Loading...</div>;
  }

  const handleButtonClick = () => {
    // Perform some action when the button is clicked
    console.log("Button clicked!");
  };

  return (
    <div className="ep-main-div">
      <div className="mp-navBar">
        <div className="mp-app-name">Travel</div>
        <div className="mp-nav-items">
          <ul>
            <li>Home</li>
            <li>Explore</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="mp-menu-icon" onClick={handle_menubtn}>
          {showMenu ? <Close_Icon /> : <Menu_Icon />}
        </div>
      </div>
      {showMenu && (
        <div className="mp-menubtn-items">
          <div id="menubtn-item">Home</div>
          <div id="menubtn-item">Explore</div>
          <div id="menubtn-item">Contact Us</div>
        </div>
      )}
      <div className="ep-div-1">
        <div
          className="ep-main-image"
          style={{
            backgroundImage: `url(${tripDetails["image"]})`,
          }}
        ></div>
        <div className="ep-div-1-detail">
          <h1>{tripDetails["title"]}</h1>
          <h3>
            From {location} ⇌ {destination}
          </h3>
          <h2>Rs. {tripDetails["cost"]}</h2>
          <div className="customize-field">
            <input type="text" placeholder="Enter text" />
            <button onClick={handleButtonClick}>Submit</button>
          </div>
        </div>
      </div>
      {/* <div className="ep-div-2">{dayPlans}</div> */}
      {tripData.map((day, index) => (
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
                      {day.description[activity]}
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
          <br></br>✓ All toll taxes, parking fees, Fuel and driver's allowances
          <br></br>✓ Welcome drink on arrival
          <br></br>✓ All Transport & Hotels Related Taxes
        </div>
        </div>
      </div>
    </div>
  );
}

export default Initial_Explore_Page;
