import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../header.styles.css";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const navigate = useNavigate();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "https://img.icons8.com/color/48/great-britain.png",
    },
    {
      code: "ja",
      name: "日本語",
      flag: "https://img.icons8.com/color/48/japan.png",
    },
    {
      code: "zh",
      name: "中文",
      flag: "https://img.icons8.com/color/48/china.png",
    },
  ];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  const handleHomeClick = () => {
    navigate("/");
    onClose();
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    onClose();
  };

  const handleProfileImageClick = () => {
    navigate("/settings");
    onClose();
  };

  // Close language dropdown when menu is closed
  React.useEffect(() => {
    if (!isOpen) {
      setIsLanguageOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        <div className="side-menu-content">
          {/* User Profile Section */}
          <div className="user-profile">
            <div
              className="profile-image"
              onClick={handleProfileImageClick}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://img.icons8.com/ios-filled/100/0078d4/user-male-circle.png"
                alt="User Profile"
              />
            </div>
            <div className="language-selector">
              <button
                className="language-button"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <img
                  src={
                    languages.find((lang) => lang.name === selectedLanguage)
                      ?.flag
                  }
                  alt={selectedLanguage}
                  className="language-flag"
                />
                {selectedLanguage}
                <span className="dropdown-arrow">▼</span>
              </button>
              {isLanguageOpen && (
                <div className="language-dropdown">
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      className="language-option"
                      onClick={() => handleLanguageSelect(lang.name)}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.name}
                        className="language-flag"
                      />
                      {lang.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <nav className="side-menu-nav">
            <ul>
              <li onClick={handleHomeClick}>Home</li>
              <li>Document Guide</li>
              <li onClick={handleSettingsClick}>Settings</li>
              <li>Help</li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="logout-section">
            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="menu-overlay" onClick={onClose} />}
    </>
  );
};

export default SideMenu;
