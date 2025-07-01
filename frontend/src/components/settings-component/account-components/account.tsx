import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import "./account.styles.css";

interface AccountProps {
  onBack: () => void;
}

const Account = ({ onBack }: AccountProps) => {
  const { currentUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
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

  const handleResetPassword = async () => {
    if (!currentUser?.email) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setShowPopup(false);
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-container">
      <div className="account-header">
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

      {/* Edit Profile Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Edit Profile</h3>
              <button
                className="close-button"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
            </div>

            <div className="popup-body">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your name"
                  className="name-input"
                />
              </div>

              <div className="popup-actions">
                <button
                  className="save-button"
                  onClick={handleSaveName}
                  disabled={loading || !newName.trim()}
                >
                  {loading ? "Saving..." : "Save Name"}
                </button>

                <button
                  className="reset-password-button"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Reset Password"}
                </button>
              </div>

              {message && (
                <div
                  className={`message ${
                    message.includes("successfully") || message.includes("sent")
                      ? "success"
                      : "error"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
