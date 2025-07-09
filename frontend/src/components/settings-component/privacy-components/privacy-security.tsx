// frontend/src/components/settings-component/privacy-components/privacy-security.tsx
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import "../account-components/account.styles.css";
import "../../shared/shared.styles.css";
import "./privacy-security.styles.css";

interface PrivacySecurityProps {
  onBack: () => void;
}

interface SecurityOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: boolean;
  action: () => void;
}

const PrivacySecurity = ({ onBack }: PrivacySecurityProps) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const [securityOptions, setSecurityOptions] = useState<SecurityOption[]>([
    {
      id: "twoFactor",
      title: "Two-Factor Authentication",
      description: "Enable or manage 2FA for extra security",
      icon: "🔒",
      status: false,
      action: () => handleTwoFactorToggle(),
    },
    {
      id: "appPermissions",
      title: "App Permissions",
      description: "Manage what data the app can access",
      icon: "📱",
      status: true,
      action: () => handleAppPermissions(),
    },
    {
      id: "dataSharing",
      title: "Data Sharing",
      description: "Control how your data is shared with third parties",
      icon: "📊",
      status: false,
      action: () => handleDataSharing(),
    },
    {
      id: "deleteAccount",
      title: "Delete Account",
      description: "Permanently delete your account and data",
      icon: "🗑️",
      status: false,
      action: () => handleDeleteAccount(),
    },
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setShowPasswordPopup(false);
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = () => {
    setSecurityOptions((prev) =>
      prev.map((option) =>
        option.id === "twoFactor"
          ? { ...option, status: !option.status }
          : option
      )
    );
  };

  const handleAppPermissions = () => {
    // TODO: Implement app permissions management
    console.log("App permissions requested");
  };

  const handleDataSharing = () => {
    setSecurityOptions((prev) =>
      prev.map((option) =>
        option.id === "dataSharing"
          ? { ...option, status: !option.status }
          : option
      )
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Account deletion confirmed");
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

        <div className="security-options">
          {securityOptions.map((option) => (
            <div
              key={option.id}
              className="security-option"
              onClick={option.action}
            >
              <div className="option-icon">{option.icon}</div>
              <div className="option-content">
                <h3 className="option-title">{option.title}</h3>
                <p className="option-description">{option.description}</p>
              </div>
              <div className="option-status">
                {option.id === "deleteAccount" ? (
                  <span className="delete-indicator">⚠️</span>
                ) : (
                  <div
                    className={`toggle-switch ${option.status ? "active" : ""}`}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
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
            </div>
            <div className="popup-actions">
              <button
                className="confirm-password-button"
                onClick={handlePasswordReset}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Send Reset Email"
                )}
              </button>
            </div>
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
      )}

      {/* Delete Account Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="popup-overlay">
          <div className="popup-content delete-popup">
            <div className="popup-header">
              <h3>Delete Account</h3>
              <button className="close-button" onClick={cancelDeleteAccount}>
                ✕
              </button>
            </div>
            <div className="popup-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>
                  <strong>This action cannot be undone.</strong>
                </p>
                <p>All your data, including:</p>
                <ul>
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
                className="confirm-delete-button"
                onClick={confirmDeleteAccount}
              >
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
