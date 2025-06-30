import { useNavigate, useLocation } from "react-router-dom";
import "./bottom-navigation.styles.css";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-navigation">
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
            src="https://img.icons8.com/ios-filled/50/FFFFFF/marker.png"
            alt="Pin Icon"
          />
        </div>
        <span>Locator</span>
      </button>

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
            src="https://img.icons8.com/ios-filled/50/FFFFFF/home.png"
            alt="home"
          />
        </div>
        <span>Home</span>
      </button>

      <button
        className={`nav-button settings-button ${
          location.pathname === "/settings" ? "active" : ""
        }`}
        onClick={() => navigate("/settings")}
      >
        <div className="nav-icon">
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/settings.png"
            alt="settings"
          />
        </div>
        <span>Settings</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
