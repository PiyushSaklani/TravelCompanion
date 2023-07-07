// store.js

import { createStore } from "redux";

const initialState = {
  images: null,
  name: null,
  location: null,
  destination: null,
  duration: null,
  date: null,
  adults: null,
  child: null,
  trip_data: null,
  initial_trip_data:null,
  showPopUp:false,
  userId:null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_IMAGES":
      return {
        ...state,
        images: action.payload,
      };
    case "SET_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "SET_DESTINATION":
      return {
        ...state,
        destination: action.payload,
      };
    case "SET_DURATION":
      return {
        ...state,
        duration: action.payload,
      };
    case "SET_DATE":
      return {
        ...state,
        date: action.payload,
      };
    case "SET_ADULTS":
      return {
        ...state,
        adults: action.payload,
      };
    case "SET_CHILD":
      return {
        ...state,
        child: action.payload,
      };
      case "SET_TRIP_DATA":
      return {
        ...state,
        trip_data: action.payload,
      };
      case "SET_INITIAL_TRIP_DATA":
      return {
        ...state,
        initial_trip_data: action.payload,
      };
      case "SET_POPUP":
      return {
        ...state,
        showPopUp: action.payload,
      };
      case "SET_USERID":
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;




// store.js