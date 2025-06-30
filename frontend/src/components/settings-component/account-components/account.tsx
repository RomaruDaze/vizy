import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import "./account.styles.css";

interface AccountProps {
  onBack: () => void;
}

const Account = ({ onBack }: AccountProps) => {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        setLoading(true);
        await logout();
        window.location.href = "/vizy/login";
      } catch (error) {
        console.error("Failed to log out:", error);
        alert("Failed to logout. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        // Add delete account functionality here
        alert("Account deletion will be implemented soon.");
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      // Add password reset functionality here
      alert("Password reset email will be sent to your email address.");
    } catch (error) {
      console.error("Failed to send password reset:", error);
      alert("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/ios-filled/50/0078d4/back.png"
            alt="back"
          />
          <span>Back</span>
        </button>
        <h1>Account Settings</h1>
      </div>

      <div className="account-content">
        {currentUser ? (
          <>
            {/* Profile Section */}
            <div className="profile-section">
              <div className="profile-header">
                <div className="profile-avatar">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {currentUser.displayName?.charAt(0).toUpperCase() ||
                        currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button className="change-avatar-btn">
                    <img
                      src="https://img.icons8.com/ios-filled/50/FFFFFF/camera.png"
                      alt="Change"
                    />
                  </button>
                </div>

                <div className="profile-info">
                  <h2>{currentUser.displayName || "User"}</h2>
                  <p className="user-email">{currentUser.email}</p>
                  <p className="user-status">
                    {currentUser.emailVerified
                      ? "✓ Email Verified"
                      : "⚠ Email Not Verified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="account-actions">
              <div className="action-group">
                <h3>Account Management</h3>

                <button
                  className="action-btn edit-profile-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <div className="action-icon">
                    <img
                      src="https://img.icons8.com/ios-filled/50/667eea/edit.png"
                      alt="Edit"
                    />
                  </div>
                  <div className="action-text">
                    <span>Edit Profile</span>
                    <small>Change your display name and photo</small>
                  </div>
                  <div className="action-arrow">
                    <img
                      src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                      alt=">"
                    />
                  </div>
                </button>

                <button
                  className="action-btn reset-password-btn"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  <div className="action-icon">
                    <img
                      src="https://img.icons8.com/ios-filled/50/667eea/password.png"
                      alt="Reset"
                    />
                  </div>
                  <div className="action-text">
                    <span>Reset Password</span>
                    <small>Send password reset email</small>
                  </div>
                  <div className="action-arrow">
                    <img
                      src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                      alt=">"
                    />
                  </div>
                </button>
              </div>

              <div className="action-group">
                <h3>Security</h3>

                <button className="action-btn privacy-btn">
                  <div className="action-icon">
                    <img
                      src="https://img.icons8.com/ios-filled/50/667eea/privacy.png"
                      alt="Privacy"
                    />
                  </div>
                  <div className="action-text">
                    <span>Privacy Settings</span>
                    <small>Manage your privacy preferences</small>
                  </div>
                  <div className="action-arrow">
                    <img
                      src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                      alt=">"
                    />
                  </div>
                </button>

                <button className="action-btn notifications-btn">
                  <div className="action-icon">
                    <img
                      src="https://img.icons8.com/ios-filled/50/667eea/notification.png"
                      alt="Notifications"
                    />
                  </div>
                  <div className="action-text">
                    <span>Notifications</span>
                    <small>Manage notification preferences</small>
                  </div>
                  <div className="action-arrow">
                    <img
                      src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                      alt=">"
                    />
                  </div>
                </button>
              </div>

              <div className="action-group">
                <h3>Account</h3>

                <button
                  className="action-btn logout-btn"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <div className="action-icon">
                    <img
                      src="https://img.icons8.com/ios-filled/50/dc3545/logout.png"
                      alt="Logout"
                    />
                  </div>
                  <div className="action-text">
                    <span>Logout</span>
                    <small>Sign out of your account</small>
                  </div>
                  <div className="action-arrow">
                    <img
                      src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                      alt=">"
                    />
                  </div>
                </button>

                <button
                  className="action-btn delete-account-btn"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  <div className="action-icon">
                    <img
                      src="https://img.icons8.com/ios-filled/50/dc3545/delete-forever.png"
                      alt="Delete"
                    />
                  </div>
                  <div className="action-text">
                    <span>Delete Account</span>
                    <small>Permanently delete your account</small>
                  </div>
                  <div className="action-arrow">
                    <img
                      src="https://img.icons8.com/ios-filled/50/999999/chevron-right.png"
                      alt=">"
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
              <div className="edit-profile-form">
                <h3>Edit Profile</h3>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="save-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Save Changes
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-user">
            <div className="no-user-icon">
              <img
                src="https://img.icons8.com/ios-filled/100/999999/user.png"
                alt="User"
              />
            </div>
            <h3>Not Logged In</h3>
            <p>Please log in to view your account information.</p>
            <a href="/vizy/login" className="login-link-btn">
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
