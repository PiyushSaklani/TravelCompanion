import React, { useState, useEffect } from "react";
import "../floating_trip_detail/trip_detail.css";
import Person_Icon from "../../icons/svg/person_icon";
import Location_Icon from "../../icons/svg/location_icon";
import Destination_Icon from "../../icons/svg/destination_icon";
import Date_Icon from "../../icons/svg/date_icon";
import Duraction_Icon from "../../icons/svg/Duration_icon";
import Adult_Icon from "../../icons/svg/Adults_icon";
import Child_Icon from "../../icons/svg/child_icon";
import Search_Icon from "../../icons/svg/search_icon";
import { useDispatch } from "react-redux";
// import Select from "react-select";
import { Select } from "antd";

function Trip_Detail() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [numAdults, setNumAdults] = useState("");
  const [numChildren, setNumChildren] = useState("");
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [gptData, setGptData] = useState();
  const [states, setStates] = useState([]);


  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/autocomplete');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching autocomplete data:', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {fetchItinerary();},[])

  const fetchItinerary = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/predef_itinerary?destination=${destination}`
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_INITIAL_TRIP_DATA", payload: data });
        // setItinerary(data);
      } else {
        await response.json();
      }
    } catch (error) {
      console.log("An error occurred");
    }
  };

  const fetchGPT = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/generate_itinerary?destination=${destination}&duration=${duration}`
      );
      const data = await response.json();
      return JSON.parse(data.itinerary);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOCATION", payload: location });
    dispatch({ type: "SET_DESTINATION", payload: destination });
    dispatch({ type: "SET_DURATION", payload: duration });
    dispatch({ type: "SET_DATE", payload: expectedDate });
    dispatch({ type: "SET_ADULTS", payload: numAdults });
    dispatch({ type: "SET_CHILD", payload: numChildren });
    await fetchItinerary();
    dispatch({ type: "SET_IMAGES", payload: true });

    // var Plan1 = await fetchGPT();
    // console.log(Plan1);
    // dispatch({ type: "SET_TRIP_DATA", payload: Plan1 });
  };

  const [selectedState, setSelectedState] = useState(null);
  const [options, setOptions] = useState([]);

  // const states = [
  //   "Andaman and Nicobar Islands",
  //   "Andhra Pradesh",
  //   "Arunachal Pradesh",
  //   "Assam",
  //   "Bihar",
  //   "Chandigarh",
  //   "Chhattisgarh",
  //   "Dadra and Nagar Haveli",
  //   "Daman and Diu",
  //   "Delhi",
  //   "Goa",
  //   "Gujarat",
  //   "Haryana",
  //   "Himachal Pradesh",
  //   "Jammu and Kashmir",
  //   "Jharkhand",
  //   "Karnataka",
  //   "Kerala",
  //   "Lakshadweep",
  //   "Madhya Pradesh",
  //   "Maharashtra",
  //   "Manipur",
  //   "Meghalaya",
  //   "Mizoram",
  //   "Nagaland",
  //   "Odisha",
  //   "Puducherry",
  //   "Punjab",
  //   "Rajasthan",
  //   "Sikkim",
  //   "Tamil Nadu",
  //   "Telangana",
  //   "Tripura",
  //   "Uttar Pradesh",
  //   "Uttarakhand",
  //   "West Bengal",
  // ];

  const convertedStates = states.map((state) => ({
    value: state,
    label: state,
  }));

  const onChangeL = (value) => {
    setLocation(value);
  };
  const onSearchL = (value) => {
    setLocation(value);
  };

  const onChangeD = (value) => {
    setDestination(value)
  };
  const onSearchD = (value) => {
    setDestination(value)
  };

  return (
    <div className="mp-input">
      <form className="mp-form" onSubmit={handleSubmit}>
        <div className="mp-form-first-row">
          <div id="mp-div">
            <Person_Icon />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="mp-form-input"
            />
          </div>
          <div id="mp-div">
            <Location_Icon />
            {/* <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="mp-form-input"
            /> */}
            <Select
              className="mp-form-input"
              showSearch
              placeholder="Current Location"
              optionFilterProp="children"
              onChange={onChangeL}
              onSearch={onSearchL}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={convertedStates}
            />
          </div>
          <div id="mp-div">
            <Destination_Icon />
            <Select
              className="mp-form-input"
              showSearch
              placeholder="Destination"
              optionFilterProp="children"
              onChange={onChangeD}
              onSearch={onSearchD}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={convertedStates}
            />
            <div style={{color:'red', height:40}}>*</div>
            {/* <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="mp-form-input"
            /> */}
          </div>
          <div id="mp-div">
            <Duraction_Icon />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mp-form-input"
              style={{ color: "gray" }}
            >
              <option>Duration</option>
              {[...Array(11)].map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
            <div style={{color:'red', height:40}}>*</div>
          </div>
          {/* </div> */}

          {/* <div className="mp-form-second-row"> */}
          <div id="mp-div">
            <Date_Icon />
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="mp-form-input"
            />
          </div>
          <div id="mp-div">
            <Adult_Icon />
            <select
              value={numAdults}
              onChange={(e) => setNumAdults(e.target.value)}
              className="mp-form-input"
              style={{ color: "gray" }}
            >
              <option>Number of Adult</option>
              {[...Array(11)].map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </div>
          <div id="mp-div">
            <Child_Icon />
            <select
              value={numChildren}
              onChange={(e) => setNumChildren(e.target.value)}
              className="mp-form-input"
              style={{ color: "gray" }}
            >
              <option>Number of Children</option>
              {[...Array(11)].map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </div>
          <div id="mp-div" className="mp-form-btn-div">
            <button type="submit">Discover</button>
          </div>
        </div>
      </form>
      {/* <div className="mp-search-div">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search . . ."
          className="mp-search-input"
        />
        <div>
          <Search_Icon />
        </div>
      </div> */}
    </div>
  );
}

export default Trip_Detail;
