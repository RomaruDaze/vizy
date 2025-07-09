import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import "./account.styles.css";

interface AccountProps {
  onBack: () => void;
}

const Account = ({ onBack }: AccountProps) => {
  const { currentUser, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [newName, setNewName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEditProfile = () => {
    setShowPopup(true);
    setNewName(currentUser?.displayName || "");
    setMessage("");
  };

  const handleSaveName = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateProfile(currentUser as User, {
        displayName: newName,
      });
      setMessage("Name updated successfully!");
      setTimeout(() => {
        setShowPopup(false);
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("Failed to update name. Please try again.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="settings-container-page ">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>Account</h1>
      </div>

      <div className="profile-section">
        <div className="profile-photo">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" />
          ) : (
            <div className="profile-placeholder">
              {currentUser?.displayName?.charAt(0) ||
                currentUser?.email?.charAt(0) ||
                "U"}
            </div>
          )}
          <button className="edit-button" onClick={handleEditProfile}>
            <img
              src="https://img.icons8.com/sf-black-filled/100/FFFFFF/pencil.png"
              alt="Edit"
            />
          </button>
        </div>

        <div className="profile-info">
          <h2 className="user-name">{currentUser?.displayName || "User"}</h2>
          <p className="user-email">{currentUser?.email || "No email"}</p>
        </div>
      </div>

      {/* Redesigned Logout Button */}
      <div className="logout-section">
        <button
          className="logout-button"
          onClick={handleLogoutClick}
          disabled={loading}
        >
          <div className="logout-icon">
            <img
              src="https://img.icons8.com/sf-black-filled/100/FFFFFF/exit.png"
              alt="Logout"
            />
          </div>
          <div className="logout-content">
            <span className="logout-text">Sign Out</span>
            <span className="logout-subtitle">Logout from your account</span>
          </div>
          <div className="logout-arrow">
            <img
              src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
              alt="Back"
            />
          </div>
        </button>
      </div>

      {/* Edit Profile Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <button
                className="close-button"
                onClick={() => setShowPopup(false)}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/back.png"
                  alt="Close"
                />
              </button>
              <h3>Edit Profile</h3>
            </div>

            <div className="popup-body">
              <div className="form-group">
                <label>Display Name</label>
                <div className="name-input-container">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="name-input"
                  />
                  <button
                    className="save-button"
                    onClick={handleSaveName}
                    disabled={loading || !newName.trim()}
                  >
                    {loading ? (
                      <img
                        src="https://img.icons8.com/ios/100/FFFFFF/hourglass.png"
                        alt="Saving"
                      />
                    ) : (
                      <img
                        src="https://img.icons8.com/sf-black-filled/100/FFFFFF/pencil.png"
                        alt="Save"
                      />
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`message ${
                    message.includes("successfully") ? "success" : "error"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Redesigned Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay" onClick={handleCancelLogout}>
          <div
            className="popup-content logout-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <div className="logout-popup-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Sign Out</h3>
              <button className="close-button" onClick={handleCancelLogout}>
                ×
              </button>
            </div>
            <div className="popup-body">
              <p>Are you sure you want to sign out of your account?</p>
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
                {loading ? (
                  <div className="loading-spinner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="31.416"
                        strokeDashoffset="31.416"
                      >
                        <animate
                          attributeName="stroke-dasharray"
                          dur="2s"
                          values="0 31.416;15.708 15.708;0 31.416"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-dashoffset"
                          dur="2s"
                          values="0;-15.708;-31.416"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                ) : (
                  "Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
