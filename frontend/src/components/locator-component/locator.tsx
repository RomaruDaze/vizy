import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSearchParams } from "react-router-dom";
import "./locator.styles.css";
import BottomNavigation from "../shared/bottom-navigation";
import Map from "./map-component/map";

const Locator = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState<string>("immigration");
  const [isAtUserLocation, setIsAtUserLocation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const mapRef = useRef<{ resetToUserLocation: () => void }>(null);

  // Check URL parameter on component mount
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "photobooth") {
      setSelectedOption("photobooth");
    } else {
      setSelectedOption("immigration");
    }
  }, [searchParams]);

  const handleImmigrationOffices = async () => {
    if (selectedOption === "immigration") return; // Already selected

    setIsLoading(true);
    setLoadingText(t("ai_loading"));
    setSelectedOption("immigration");
  };

  const handlePhotoBooths = async () => {
    if (selectedOption === "photobooth") return; // Already selected

    setIsLoading(true);
    setLoadingText(t("ai_loading_photo"));
    setSelectedOption("photobooth");
  };

  const handleResetLocation = () => {
    if (mapRef.current && mapRef.current.resetToUserLocation) {
      mapRef.current.resetToUserLocation();
    }
  };

  const handleViewChange = (isAtUserLocation: boolean) => {
    setIsAtUserLocation(isAtUserLocation);
  };

  // Callback to handle when markers are loaded
  const handleMarkersLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="locator-container">
      <div className="top-section">
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/map.png"
          alt="Logo"
        />
        <h1>{t("maps")}</h1>
      </div>

      <div className="middle-section">
        <div className="map-wrapper">
          <Map
            locationType={selectedOption}
            ref={mapRef}
            onViewChange={handleViewChange}
            onMarkersLoaded={handleMarkersLoaded}
            isLoading={isLoading}
          />
        </div>

        {/* Loading overlay when switching options */}
        {isLoading && (
          <div className="locator-loading-overlay">
            <div className="locator-loading-content">
              <div className="locator-loading-animation">
                <div className="locator-pulse-ring"></div>
                <div className="locator-icon">
                  <img
                    src={
                      selectedOption === "immigration"
                        ? "https://img.icons8.com/ios-filled/100/FFFFFF/office.png"
                        : "https://img.icons8.com/ios-filled/100/FFFFFF/camera.png"
                    }
                    alt="Loading"
                  />
                </div>
              </div>
              <div className="locator-loading-text">
                <h3>{loadingText}</h3>
                <div className="locator-loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Only show reset button when not at user location */}
        {!isAtUserLocation && (
          <button className="reset-button" onClick={handleResetLocation}>
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/center-direction.png"
              alt="Reset Location"
            />
            <span>{t("reset_location")}</span>
          </button>
        )}

        <div className="locator-options-overlay">
          <div className="locator-buttons">
            <button
              className={`locator-option immigration-offices ${
                selectedOption === "immigration" ? "active" : ""
              } ${isLoading ? "disabled" : ""}`}
              onClick={handleImmigrationOffices}
              disabled={isLoading}
            >
              <div className="option-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/666666/office.png"
                  alt="Immigration Offices"
                />
              </div>
              <div className="option-info">
                <h2>{t("immigration_offices")}</h2>
              </div>
            </button>

            <button
              className={`locator-option photo-booths ${
                selectedOption === "photobooth" ? "active" : ""
              } ${isLoading ? "disabled" : ""}`}
              onClick={handlePhotoBooths}
              disabled={isLoading}
            >
              <div className="option-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/666666/camera.png"
                  alt="Photo Booths"
                />
              </div>
              <div className="option-info">
                <h2>{t("photo_booths")}</h2>
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
