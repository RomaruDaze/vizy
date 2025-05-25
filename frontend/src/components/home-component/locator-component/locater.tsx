import React from "react";
import "./locator.styles.css";

const Locater = () => {
  return (
    <button className="locater-container">
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
  );
};

export default Locater;
