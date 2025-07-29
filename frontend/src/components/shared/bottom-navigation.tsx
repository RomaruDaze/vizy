import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "./bottom-navigation.styles.css";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="bottom-navigation">
      <button
        className={`nav-button home-button ${
          location.pathname === "/" || location.pathname === "/vizy"
            ? "active"
            : ""
        }`}
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="nav-icon">
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/home.png"
            alt="home"
          />
        </div>
        <span>{t("home")}</span>
      </button>
      <button
        className={`nav-button ai-button ${
          location.pathname === "/ai-form-assistant" ? "active" : ""
        }`}
        onClick={() => {
          navigate("/ai-form-assistant");
        }}
      >
        <div className="nav-icon">
          <img
            src="https://img.icons8.com/glyph-neue/64/FFFFFF/bard--v2.png"
            alt="chat"
          />
        </div>
        <span>{t("ai_chat")}</span>
      </button>

      <button
        className={`nav-button locator-button ${
          location.pathname === "/locator" ? "active" : ""
        }`}
        onClick={() => {
          navigate("/locator");
        }}
      >
        <div className="nav-icon">
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/map.png"
            alt="Pin Icon"
          />
        </div>
        <span>{t("maps")}</span>
      </button>

      <button
        className={`nav-button settings-button ${
          location.pathname === "/settings" ? "active" : ""
        }`}
        onClick={() => {
          navigate("/settings");
        }}
      >
        <div className="nav-icon">
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/settings.png"
            alt="settings"
          />
        </div>
        <span>{t("settings")}</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
