import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Account from "./account-components/account";
import Help from "./help-components/help";
import PrivacySecurity from "./privacy-components/privacy-security";
import BottomNavigation from "../shared/bottom-navigation";
import NotificationTest from "../NotificationTest";
import "./settings.styles.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = async () => {
    setLoading(true);
    try {
      await logout();
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
      setShowLogoutPopup(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
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
        <h1>Settings</h1>
      </div>

      <div className="middle-section">
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
              <h3>Account</h3>
              <p>Manage your profile and account settings</p>
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
              <h3>Help & Support</h3>
              <p>Get help and contact support</p>
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
              <h3>Privacy & Security</h3>
              <p>Manage your privacy and security settings</p>
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
          >
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/667eea/notification.png"
                alt="Notifications"
              />
            </div>
            <div className="card-content">
              <h3>Notification Test</h3>
              <p>Test push notifications</p>
            </div>
            <div className="card-arrow">
              <img
                src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                alt=">"
              />
            </div>
          </button>

          <button
            className="settings-card logout-card"
            onClick={handleLogoutClick}
          >
            <div className="card-icon logout-icon">
              <img
                src="https://img.icons8.com/ios-glyphs/100/999999/open-pane.png"
                alt="Logout"
              />
            </div>
            <div className="card-content">
              <h3>Logout</h3>
              <p>Sign out of your account</p>
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

      <div className="bottom-section">
        <BottomNavigation />
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay" onClick={handleCancelLogout}>
          <div
            className="popup-content logout-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h3>Confirm Logout</h3>
              <button className="close-button" onClick={handleCancelLogout}>
                ×
              </button>
            </div>

            <div className="popup-body">
              <div className="logout-header">
                <img
                  src="https://img.icons8.com/ios-glyphs/100/open-pane.png"
                  alt="Logout"
                />
                <p className="logout-message">
                  Are you sure you want to logout? You will need to sign in
                  again to access your account.
                </p>
              </div>

              <div className="popup-actions">
                <button
                  className="cancel-button"
                  onClick={handleCancelLogout}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="confirm-logout-button"
                  onClick={handleConfirmLogout}
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Yes, Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
