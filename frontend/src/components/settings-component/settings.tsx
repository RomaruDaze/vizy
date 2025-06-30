import { useState } from "react";
import Account from "./account-components/account";
import Help from "./help-components/help";
import PrivacySecurity from "./privacy-components/privacy-security";
import BottomNavigation from "../shared/bottom-navigation";
import "./settings.styles.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  if (activeSection === "account") {
    return <Account onBack={handleBack} />;
  }

  if (activeSection === "help") {
    return <Help onBack={handleBack} />;
  }

  if (activeSection === "privacy") {
    return <PrivacySecurity onBack={handleBack} />;
  }

  return (
    <div className="settings-container">
      <div className="top-section">
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/settings.png"
          alt="Settings"
        />
        <h1>Settings</h1>
      </div>

      <div className="middle-section">
        <div className="settings-options">
          <button
            className="settings-option"
            onClick={() => handleSectionClick("account")}
          >
            <div className="option-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/FFFFFF/user.png"
                alt="Account"
              />
            </div>
            <div className="option-info">
              <h2>Account</h2>
              <p>Manage your account</p>
            </div>
          </button>

          <button
            className="settings-option"
            onClick={() => handleSectionClick("help")}
          >
            <div className="option-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/FFFFFF/help.png"
                alt="Help"
              />
            </div>
            <div className="option-info">
              <h2>Help & Support</h2>
              <p>Get help and contact support</p>
            </div>
          </button>

          <button
            className="settings-option"
            onClick={() => handleSectionClick("privacy")}
          >
            <div className="option-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/FFFFFF/privacy.png"
                alt="Privacy"
              />
            </div>
            <div className="option-info">
              <h2>Privacy & Security</h2>
              <p>Manage your privacy settings</p>
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

export default Settings;
