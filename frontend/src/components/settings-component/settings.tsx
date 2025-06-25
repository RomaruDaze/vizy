import { useState } from "react";
import "./settings.styles.css";
import Account from "./account-components/account";
import BottomNavigation from "../shared/bottom-navigation";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsSections = [
    {
      id: "account",
      title: "Account",
      icon: "https://img.icons8.com/ios-filled/50/0078d4/user-male-circle.png",
      description: "Manage your account settings and preferences",
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: "https://img.icons8.com/ios-filled/50/0078d4/paint-palette.png",
      description: "Customize the look and feel of the application",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: "https://img.icons8.com/ios-filled/50/0078d4/lock.png",
      description: "Manage your privacy settings and security options",
    },
    {
      id: "help",
      title: "Help",
      icon: "https://img.icons8.com/ios-filled/50/0078d4/headset.png",
      description: "Get support and view documentation",
    },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="settings-container">
      {activeSection === "account" ? (
        <div className="section-overlay">
          <Account onBack={() => setActiveSection(null)} />
        </div>
      ) : (
        <>
          <div className="top-section">
            <h1 className="settings-header">Settings</h1>
          </div>
          <div className="middle-section">
            <div className="settings-grid">
              {settingsSections.map((section) => (
                <div
                  key={section.id}
                  className="settings-card"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="settings-card-content">
                    <div className="settings-icon">
                      <img src={section.icon} alt={section.title} />
                    </div>
                    <div className="settings-info">
                      <h2>{section.title}</h2>
                      <p>{section.description}</p>
                    </div>
                    <div className="settings-arrow">
                      <img
                        src="https://img.icons8.com/ios-filled/50/0078d4/chevron-right.png"
                        alt="arrow"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom-section">
            <BottomNavigation />
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
