import React, { useState } from "react";
import "./settings.styles.css";
import Account from "./account-components/account";

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
      id: "reminder",
      title: "Reminder",
      icon: "https://img.icons8.com/ios-filled/50/0078d4/bell.png",
      description: "Configure your reminder notifications and schedules",
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
    {
      id: "about",
      title: "About",
      icon: "https://img.icons8.com/ios-filled/50/0078d4/info.png",
      description: "Learn more about the application",
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
          <div className="settings-header">
            <h1>Settings</h1>
          </div>
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
        </>
      )}
    </div>
  );
};

export default Settings;
