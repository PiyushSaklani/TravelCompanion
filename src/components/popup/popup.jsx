import React from "react";
import "../popup/popup.css";

function PopUp(props) {
  return (
    <div className="popup-main-div">
      <div className="popup-inner-div">
        <div className="popup-content">
          All the details of this trip have been sent to you!
          <button onClick={props.onClick} className="popupbtn">
            Close
          </button>
        </div>

        <div className="popup-icon"></div>
      </div>
    </div>
  );
}

export default PopUp;
