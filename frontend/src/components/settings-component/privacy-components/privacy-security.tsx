// frontend/src/components/settings-component/privacy-components/privacy-security.tsx
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { deleteUser } from "firebase/auth";
import { ref, remove } from "firebase/database";
import { database } from "../../../firebase/config";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {
  getErrorCode,
  getErrorMessage,
  FirebaseErrorCodes,
} from "../../../utils/firebaseErrors";
import "../account-components/account.styles.css";
import "./privacy-security.styles.css";

interface PrivacySecurityProps {
  onBack: () => void;
}

const PrivacySecurity = ({ onBack }: PrivacySecurityProps) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
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
      setMessage(t("password_reset_email_sent"));
      setTimeout(() => {
        setShowPasswordPopup(false);
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      const errorCode = getErrorCode(error);
      if (errorCode === FirebaseErrorCodes.AUTH_USER_NOT_FOUND) {
        setMessage(t("no_account_found_email"));
      } else if (errorCode === FirebaseErrorCodes.AUTH_INVALID_EMAIL) {
        setMessage(t("invalid_email_format"));
      } else if (errorCode === FirebaseErrorCodes.AUTH_TOO_MANY_REQUESTS) {
        setMessage(t("too_many_requests"));
      } else {
        setMessage(`${t("failed_send_reset_email")}: ${getErrorMessage(error)}`);
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
    } catch (error) {
      console.error("Error deleting account:", error);
      const errorCode = getErrorCode(error);

      if (errorCode === "auth/requires-recent-login") {
        setShowDeleteConfirm(false);
        setShowReauthPopup(true);
      } else {
        alert(t("failed_delete_account"));
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReauthenticate = async () => {
    if (!currentUser?.email || !password) {
      setDeleteError(t("please_enter_password"));
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
    } catch (error) {
      console.error("Re-authentication error:", error);
      const errorCode = getErrorCode(error);

      if (errorCode === FirebaseErrorCodes.AUTH_WRONG_PASSWORD) {
        setDeleteError(t("incorrect_password"));
      } else if (errorCode === "auth/user-mismatch") {
        setDeleteError(t("authentication_failed"));
      } else {
        setDeleteError(`${t("reauthentication_failed")}: ${getErrorMessage(error)}`);
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
        <h1>{t("privacy_security")}</h1>
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
              <span className="privacy-text">{t("reset_password")}</span>
              <span className="privacy-subtitle">
                {t("send_password_reset_email_to")} {currentUser?.email}
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
              <span className="privacy-text">{t("delete_account")}</span>
              <span className="privacy-subtitle">
                {t("permanently_delete_account_data")}
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
              <h3>{t("reset_password")}</h3>
            </div>
            <div className="popup-body">
              <p>
                {t("send_password_reset_link_to")}{" "}
                <strong>{currentUser?.email}</strong>
              </p>

              <button
                className="confirm-password-button"
                onClick={handlePasswordReset}
                disabled={loading}
              >
                {loading ? t("sending") : t("send_reset_email")}
              </button>

              {message && (
                <div
                  className={`message ${
                    message.includes(t("sent")) ? "success" : "error"
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
              <h3>{t("delete_account")}</h3>
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
                    <span className="warning-icon">⚠️</span>{" "}
                    {t("action_cannot_undone")}
                  </strong>
                </p>
                <p>{t("all_your_data_including")}:</p>
                <ul className="delete-list">
                  <li>{t("profile_information")}</li>
                  <li>{t("saved_preferences")}</li>
                  <li>{t("account_history")}</li>
                  <li>{t("all_app_data")}</li>
                </ul>
                <p>{t("will_be_permanently_deleted")}</p>
              </div>
            </div>
            <div className="popup-actions">
              <button className="cancel-button" onClick={cancelDeleteAccount}>
                {t("cancel")}
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
                    {t("delete_account")}
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
              <h3>{t("reauthenticate")}</h3>
            </div>
            <div className="popup-body">
              <p>{t("security_reasons_enter_password")}</p>
              <input
                type="password"
                placeholder={t("enter_your_password")}
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
                {deleteLoading ? t("deleting") : t("confirm_deletion")}
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
