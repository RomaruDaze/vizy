import React, { useState } from "react";
import "./locator.styles.css";
import LocatorPopup from "./locator-popup-component/locator-popup";

const Locater = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="locater-wrapper">
      <button className="locater-container" onClick={handleClick}>
        <div className="locater-content">
          <div className="pin-icon">
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/marker.png"
              alt="Pin Icon"
            />
          </div>
          <span className="locate-text">Locate</span>
        </div>
      </button>
      {showPopup && <LocatorPopup onClose={handleClose} />}
    </div>
  );
};

export default Locater;
