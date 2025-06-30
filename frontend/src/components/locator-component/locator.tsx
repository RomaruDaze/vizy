import { useState, useRef } from "react";
import "./locator.styles.css";
import BottomNavigation from "../shared/bottom-navigation";
import Map from "./map-component/map";

const Locator = () => {
  const [selectedOption, setSelectedOption] = useState<string>("immigration");
  const mapRef = useRef<{ resetToUserLocation: () => void }>(null);

  const handleImmigrationOffices = () => {
    setSelectedOption("immigration");
  };

  const handlePhotoBooths = () => {
    setSelectedOption("photobooth");
  };

  const handleResetLocation = () => {
    if (mapRef.current) {
      mapRef.current.resetToUserLocation();
    }
  };

  return (
    <div className="locator-container">
      <div className="top-section">
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/map.png"
          alt="Logo"
        />
        <h1>Map</h1>
      </div>

      <div className="middle-section">
        <div className="map-wrapper">
          <Map locationType={selectedOption} ref={mapRef} />
        </div>

        <button className="reset-button" onClick={handleResetLocation}>
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/center-direction.png"
            alt="Reset Location"
          />
          <span>Reset</span>
        </button>

        <div className="locator-options-overlay">
          <div className="locator-buttons">
            <button
              className={`locator-option immigration-offices ${
                selectedOption === "immigration" ? "active" : ""
              }`}
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
              </div>
            </button>

            <button
              className={`locator-option photo-booths ${
                selectedOption === "photobooth" ? "active" : ""
              }`}
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
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Locator;
