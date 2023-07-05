import React, { useState, useEffect } from "react";
import "../explore-page/explore_page.css";
import Close_Icon from "../../icons/svg/close_icon";
import Menu_Icon from "../../icons/svg/menu_icon";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import loading_gif from "../../images/loading.gif";
import PopUp from "../../components/popup/popup";

function Explore_Page() {
  const [showPopUp, setShowPopUp] = useState(false);
  const images = useSelector((state) => state.images);
  const destination = useSelector((state) => state.destination);
  const location = useSelector((state) => state.location);
  const duration = useSelector((state) => state.duration);
  const date = useSelector((state) => state.date);
  const adults = useSelector((state) => state.adults);
  const child = useSelector((state) => state.child);
  const trip_data = useSelector((state) => state.trip_data);
  const { id, days } = useParams();
  const initial_trip_data = useSelector((state) => state.initial_trip_data);
  const [customizationInput, setCustomizationInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setCustomizationInput(event.target.value);
  };

  const [tripData, setTrip_detail] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  function handle_menubtn() {
    setShowMenu(!showMenu);
  }

  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/details");

        if (response.ok) {
          const data = await response.json();
          console.log(data[destination][days]["it"]);
          setTrip_detail(data[destination][days]);
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

  // Function to fetch itinerary data
  const fetchItinerary = async (string, destination, numDays, summary) => {
    try {
      const response = await axios.get("http://192.168.29.164:5001/gen_it", {
        params: {
          string,
          destination,
          num_days: numDays,
          summary,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while fetching itinerary data");
    }
  };

  const handleButtonClick = async () => {
    setLoading(true);
    console.log("process start");
    await fetchItinerary(
      customizationInput,
      destination,
      tripData.num_days,
      tripData.summary
    )
      .then((itineraryData) => {
        setTrip_detail(itineraryData);
        setLoading(false);
        console.log(itineraryData);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        setLoading(false);
      });
    // Perform some action when the button is clicked
    console.log("Button clicked!");
  };

  const handlePopup = () => {
    setShowPopUp(false)
  }

  return (
    <>
      {showPopUp ? (
        <PopUp onClick={handlePopup}/>
      ) : (
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
                backgroundImage: `url(${initial_trip_data[id]["image"]})`,
              }}
            ></div>
            <div className="ep-div-1-detail">
              <div className="ep-deal-div"></div>
              <div className="ep-place-title">
                {initial_trip_data[id]["title"]}
              </div>
              <div className="ep-place-new-cost">
                Rs. {initial_trip_data[id]["cost"]}
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
          </div>
          {/* <div className="ep-div-2">{dayPlans}</div> */}
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
                <br></br>✓ All toll taxes, parking fees, Fuel and driver's
                allowances
                <br></br>✓ Welcome drink on arrival
                <br></br>✓ All Transport & Hotels Related Taxes
              </div>
            </div>
          </div>
          {/* https://www.google.com/travel/flights */}
          <button
            className="confirm-btn"
            onClick={() => {
              setShowPopUp(true)
            }}
          >
            Save Itinerary
          </button>
          <button
            className="confirm-btn"
            onClick={() => {
              window.open('https://www.google.com/travel/flights', '_blank');
            }}
          >
            Search Flights
          </button>
        </div>
      )}
    </>
  );
}

export default Explore_Page;
