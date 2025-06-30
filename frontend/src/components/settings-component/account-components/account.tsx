import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import "./account.styles.css";
import { updateProfile } from "firebase/auth";

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
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      // Update profile logic will be implemented here
      // await updateProfile(currentUser, { displayName });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) return;

    try {
      setLoading(true);
      // Password reset logic will be implemented here
      // await sendPasswordResetEmail(auth, currentUser.email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (newName: string) => {
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: newName });
        // Force a re-render
        window.location.reload();
      } catch (error) {
        console.error("Failed to update display name:", error);
      }
    }
  };

  return (
    <div className="account-container">
      <div className="section-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/ios-filled/50/0078d4/back.png"
            alt="back"
          />
          Back
        </button>
      </div>

      <div className="account-content">
        <h2>Account Settings</h2>

        {currentUser && (
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser.email?.charAt(0).toUpperCase()}
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
                <h3>{currentUser.displayName || "User"}</h3>
                <p>{currentUser.email}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit.png"
                  alt="Edit"
                />
                Edit Profile
              </button>

              <button
                className="reset-password-btn"
                onClick={handleResetPassword}
                disabled={loading}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/password.png"
                  alt="Reset"
                />
                Reset Password
              </button>

              <button className="logout-btn" onClick={handleLogout}>
                <img
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/logout.png"
                  alt="Logout"
                />
                Logout
              </button>
            </div>

            {isEditing && (
              <div className="edit-profile-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="save-btn"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
