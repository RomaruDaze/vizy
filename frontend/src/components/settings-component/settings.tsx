import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Account from "./account-components/account";
import Help from "./help-components/help";
import PrivacySecurity from "./privacy-components/privacy-security";
import Accessibility from "./accessibility-components/accessibility";
import BottomNavigation from "../shared/bottom-navigation";
import NotificationTest from "../notification-components/NotificationTest";
import "./settings.styles.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  if (activeSection === "account") {
    return <Account onBack={handleBack} />;
  }

  if (activeSection === "accessibility") {
    return <Accessibility onBack={handleBack} />;
  }

  if (activeSection === "help") {
    return <Help onBack={handleBack} />;
  }

  if (activeSection === "privacy") {
    return <PrivacySecurity onBack={handleBack} />;
  }

  if (activeSection === "notification-test") {
    return <NotificationTest />;
  }

  return (
    <div className="settings-container">
      <div className="top-section">
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/settings.png"
          alt="Settings"
        />
        <h1>{t("settings")}</h1>
      </div>

      <div className="middle-section">
        <div className="settings-grid-container">
          <div className="settings-grid">
            <button
              className="settings-card"
              onClick={() => handleSectionClick("account")}
            >
              <div className="card-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/667eea/user.png"
                  alt="Account"
                />
              </div>
              <div className="card-content">
                <h3>{t("account")}</h3>
                <p>{t("manage_profile_account")}</p>
              </div>
              <div className="card-arrow">
                <img
                  src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                  alt=">"
                />
              </div>
            </button>
            <button
              className="settings-card"
              onClick={() => handleSectionClick("accessibility")}
            >
              <div className="card-icon">
                <img
                  src="https://img.icons8.com/pastel-glyph/100/paint-palette.png"
                  alt="Accessibility"
                />
              </div>
              <div className="card-content">
                <h3>{t("accessibility")}</h3>
                <p>{t("choose_theme_colors")}</p>
              </div>
              <div className="card-arrow">
                <img
                  src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                  alt=">"
                />
              </div>
            </button>
            <button
              className="settings-card"
              onClick={() => handleSectionClick("help")}
            >
              <div className="card-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/667eea/help.png"
                  alt="Help"
                />
              </div>
              <div className="card-content">
                <h3>{t("help_support")}</h3>
                <p>{t("get_help_contact_support")}</p>
              </div>
              <div className="card-arrow">
                <img
                  src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                  alt=">"
                />
              </div>
            </button>
            <button
              className="settings-card"
              onClick={() => handleSectionClick("privacy")}
            >
              <div className="card-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/667eea/privacy.png"
                  alt="Privacy"
                />
              </div>
              <div className="card-content">
                <h3>{t("privacy_security")}</h3>
                <p>{t("manage_privacy_security")}</p>
              </div>
              <div className="card-arrow">
                <img
                  src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                  alt=">"
                />
              </div>
            </button>
            <button
              className="settings-card"
              onClick={() => handleSectionClick("notification-test")}
              style={{ opacity: 0 }}
            >
              <div className="card-icon">
                <img
                  src="https://img.icons8.com/ios-filled/50/667eea/notification.png"
                  alt="Notifications"
                />
              </div>
              <div className="card-content">
                <h3>{t("notification_test")}</h3>
                <p>{t("test_push_notifications")}</p>
              </div>
              <div className="card-arrow">
                <img
                  src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                  alt=">"
                />
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

export default Settings;
