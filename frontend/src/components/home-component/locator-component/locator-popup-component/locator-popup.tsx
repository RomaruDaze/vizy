import React, { useState } from "react";
import "./locator-popup.styles.css";
import Map from "../map-component/map";

interface LocatorPopupProps {
  onClose: () => void;
}

const LocatorPopup = ({ onClose }: LocatorPopupProps) => {
  const [showMap, setShowMap] = useState(false);

  const handleImmigrationOfficeClick = () => {
    setShowMap(true);
  };

  const handleMapClose = () => {
    setShowMap(false);
  };

  if (showMap) {
    return (
      <div className="popup-overlay">
        <div className="map-popup">
          <button className="close-button" onClick={handleMapClose}>
            ×
          </button>
          <h3>
            <img
              src="https://img.icons8.com/external-lylac-kerismaker/25/external-Pin-Map-location-lylac-kerismaker.png"
              alt="Pin Icon"
            />
            <span> Immigration Office Map</span>
          </h3>
          <div className="map-container">
            <Map />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="locator-popup">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h3>
          <img
            src="https://img.icons8.com/external-lylac-kerismaker/25/external-Pin-Map-location-lylac-kerismaker.png"
            alt="Pin Icon"
          />
          <span> Locator</span>
        </h3>
        <div className="button-container">
          <button
            className="option-button"
            onClick={handleImmigrationOfficeClick}
          >
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/passport.png"
              alt="Pin Icon"
            />
            <p>Immigration Office</p>
          </button>
          <button className="option-button">
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/selfie-booth.png"
              alt="Pin Icon"
            />
            <p>Passport Photo Machine</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocatorPopup;
