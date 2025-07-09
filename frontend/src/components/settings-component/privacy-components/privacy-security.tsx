// frontend/src/components/settings-component/privacy-components/privacy-security.tsx
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { deleteUser } from "firebase/auth";
import "../account-components/account.styles.css";
import "./privacy-security.styles.css";

interface PrivacySecurityProps {
  onBack: () => void;
}

const PrivacySecurity = ({ onBack }: PrivacySecurityProps) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;

    setLoading(true);
    try {
      // Add action code settings for better compatibility
      const actionCodeSettings = {
        url: `${window.location.origin}/vizy/login`,
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, currentUser.email, actionCodeSettings);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setShowPasswordPopup(false);
        setMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Provide more specific error messages
      if (error.code === "auth/user-not-found") {
        setMessage("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Invalid email address format.");
      } else if (error.code === "auth/too-many-requests") {
        setMessage("Too many requests. Please try again later.");
      } else {
        setMessage(`Failed to send reset email: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      if (currentUser) {
        // Delete the user account from Firebase
        await deleteUser(currentUser);
        console.log("Account deleted successfully");

        // Redirect to signup page
        window.location.href = "/vizy/signup";
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);

      if (error.code === "auth/requires-recent-login") {
        alert(
          "For security reasons, please log out and log back in before deleting your account."
        );
      } else {
        alert("Failed to delete account. Please try again.");
      }
    }
    setShowDeleteConfirm(false);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="settings-container-page">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>Privacy & Security</h1>
      </div>

      <div className="privacy-content">
        {/* Password Reset Button */}
        <div className="password-reset-section">
          <button
            className="password-reset-button"
            onClick={() => setShowPasswordPopup(true)}
            disabled={loading}
          >
            <div className="password-icon">
              <img
                src="https://img.icons8.com/sf-black-filled/100/FFFFFF/lock.png"
                alt="Password"
              />
            </div>
            <div className="password-content">
              <span className="password-text">Reset Password</span>
              <span className="password-subtitle">
                Send password reset email to {currentUser?.email}
              </span>
            </div>
            <div className="password-arrow">
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
            </div>
          </button>
        </div>

        {/* Delete Account Button */}
        <div className="password-reset-section">
          <button
            className="password-reset-button"
            onClick={handleDeleteAccount}
          >
            <div className="password-icon">
              <img
                src="https://img.icons8.com/sf-black-filled/100/FFFFFF/delete.png"
                alt="Delete"
              />
            </div>
            <div className="password-content">
              <span className="password-text">Delete Account</span>
              <span className="password-subtitle">
                Permanently delete your account and data
              </span>
            </div>
            <div className="password-arrow">
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Password Reset Confirmation Popup */}
      {showPasswordPopup && (
        <div
          className="popup-overlay"
          onClick={() => setShowPasswordPopup(false)}
        >
          <div
            className="popup-content password-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <button
                className="close-button"
                onClick={() => setShowPasswordPopup(false)}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/back.png"
                  alt="Close"
                />
              </button>
              <h3>Reset Password</h3>
            </div>
            <div className="popup-body">
              <p>
                We'll send a password reset link to{" "}
                <strong>{currentUser?.email}</strong>
              </p>

              <button
                className="confirm-password-button"
                onClick={handlePasswordReset}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>

              {message && (
                <div
                  className={`message ${
                    message.includes("sent") ? "success" : "error"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="popup-overlay">
          <div className="popup-content delete-popup">
            <div className="popup-header">
              <h3>Delete Account</h3>
              <button className="close-button" onClick={cancelDeleteAccount}>
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Delete"
                />
              </button>
            </div>
            <div className="popup-body">
              <div className="delete-warning">
                <p>
                  <strong>
                    <span className="warning-icon">⚠️</span> This action cannot
                    be undone.
                  </strong>
                </p>
                <p>All your data, including:</p>
                <ul className="delete-list">
                  <li>Profile information</li>
                  <li>Saved preferences</li>
                  <li>Account history</li>
                  <li>All app data</li>
                </ul>
                <p>will be permanently deleted.</p>
              </div>
            </div>
            <div className="popup-actions">
              <button className="cancel-button" onClick={cancelDeleteAccount}>
                Cancel
              </button>
              <button className="delete-button" onClick={confirmDeleteAccount}>
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/delete.png"
                  alt="Delete"
                />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySecurity;
