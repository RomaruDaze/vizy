// frontend/src/components/settings-component/privacy-components/privacy-security.tsx
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { deleteUser } from "firebase/auth";
import { ref, remove } from "firebase/database";
import { database } from "../../../firebase/config";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import "../account-components/account.styles.css";
import "./privacy-security.styles.css";

interface PrivacySecurityProps {
  onBack: () => void;
}

const PrivacySecurity = ({ onBack }: PrivacySecurityProps) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReauthPopup, setShowReauthPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;

    setLoading(true);
    try {
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
    setDeleteLoading(true);

    try {
      if (currentUser) {
        // Clean up user data from Realtime Database FIRST
        if (currentUser.uid) {
          const userRef = ref(database, `users/${currentUser.uid}`);
          await remove(userRef);
        }

        // Delete the Firebase Auth user
        await deleteUser(currentUser);

        // Redirect to signup page
        window.location.href = "/login";
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);

      if (error.code === "auth/requires-recent-login") {
        setShowDeleteConfirm(false);
        setShowReauthPopup(true);
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReauthenticate = async () => {
    if (!currentUser?.email || !password) {
      setDeleteError("Please enter your password");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Clean up user data FIRST
      if (currentUser.uid) {
        const userRef = ref(database, `users/${currentUser.uid}`);
        await remove(userRef);
      }

      // Delete the Firebase Auth user
      await deleteUser(currentUser);

      // Redirect to signup page
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Re-authentication error:", error);

      if (error.code === "auth/wrong-password") {
        setDeleteError("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-mismatch") {
        setDeleteError("Authentication failed. Please try again.");
      } else {
        setDeleteError(`Re-authentication failed: ${error.message}`);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setShowReauthPopup(false);
    setPassword("");
    setDeleteError("");
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
        <div className="privacy-section">
          <button
            className="privacy-button"
            onClick={() => setShowPasswordPopup(true)}
            disabled={loading}
          >
            <div className="privacy-icon">
              <img
                src="https://img.icons8.com/sf-black-filled/100/FFFFFF/lock.png"
                alt="Password"
              />
            </div>
            <div className="privacy-content">
              <span className="privacy-text">Reset Password</span>
              <span className="privacy-subtitle">
                Send password reset email to {currentUser?.email}
              </span>
            </div>
            <div className="privacy-arrow">
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
            </div>
          </button>
        </div>

        {/* Delete Account Button */}
        <div className="privacy-section">
          <button
            className="privacy-button"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            <div className="privacy-icon">
              <img
                src="https://img.icons8.com/sf-black-filled/100/FFFFFF/delete.png"
                alt="Delete"
              />
            </div>
            <div className="privacy-content">
              <span className="privacy-text">Delete Account</span>
              <span className="privacy-subtitle">
                Permanently delete your account and data
              </span>
            </div>
            <div className="privacy-arrow">
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
              <button
                className="delete-button"
                onClick={confirmDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
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
                  <>
                    <img
                      src="https://img.icons8.com/sf-black-filled/100/FFFFFF/delete.png"
                      alt="Delete"
                    />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-authentication Popup */}
      {showReauthPopup && (
        <div className="popup-overlay">
          <div className="popup-content password-popup">
            <div className="popup-header">
              <button className="close-button" onClick={cancelDeleteAccount}>
                <img
                  src="https://img.icons8.com/sf-black-filled/100/back.png"
                  alt="Close"
                />
              </button>
              <h3>Re-authenticate</h3>
            </div>
            <div className="popup-body">
              <p>
                For security reasons, please enter your password to confirm
                account deletion.
              </p>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                disabled={deleteLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && password && !deleteLoading) {
                    handleReauthenticate();
                  }
                }}
                autoFocus
              />
              <button
                className="confirm-password-button"
                onClick={handleReauthenticate}
                disabled={deleteLoading || !password}
              >
                {deleteLoading ? "Deleting..." : "Confirm Deletion"}
              </button>

              {deleteError && (
                <div className="message error">{deleteError}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySecurity;
