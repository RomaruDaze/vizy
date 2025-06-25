import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./locator.styles.css";
import BottomNavigation from "../shared/bottom-navigation";
import Map from "./map-component/map";

const Locator = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleImmigrationOffices = () => {
    setSelectedOption("immigration");
    setShowMap(true);
  };

  const handlePhotoBooths = () => {
    setSelectedOption("photobooth");
    setShowMap(true);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleMapClose = () => {
    setShowMap(false);
    setSelectedOption("");
  };

  if (showMap) {
    return (
      <div className="locator-container">
        <div className="top-section">
          <button className="back-button" onClick={handleMapClose}>
            <img
              src="https://img.icons8.com/ios-filled/50/0078d4/chevron-left.png"
              alt="Back"
            />
            <span>Back</span>
          </button>
          <h1>
            {selectedOption === "immigration"
              ? "Immigration Offices"
              : "Photo Booths"}
          </h1>
        </div>

        <div className="middle-section">
          <div className="map-wrapper">
            <Map locationType={selectedOption} />
          </div>
        </div>

        <div className="bottom-section">
          <BottomNavigation />
        </div>
      </div>
    );
  }

  return (
    <div className="locator-container">
      <div className="top-section">
        <h1>Locator</h1>
      </div>

      <div className="middle-section">
        <div className="locator-buttons">
          <button
            className="locator-option immigration-offices"
            onClick={handleImmigrationOffices}
          >
            <div className="option-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/FFFFFF/office.png"
                alt="Immigration Offices"
              />
            </div>
            <div className="option-info">
              <h2>Immigration Offices</h2>
              <p>Find nearby immigration offices and their services</p>
            </div>
          </button>

          <button
            className="locator-option photo-booths"
            onClick={handlePhotoBooths}
          >
            <div className="option-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/FFFFFF/camera.png"
                alt="Photo Booths"
              />
            </div>
            <div className="option-info">
              <h2>Photo Booths</h2>
              <p>Locate photo booths for passport photos</p>
            </div>
          </button>
        </div>
      </div>

      <div className="bottom-section">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Locator;
