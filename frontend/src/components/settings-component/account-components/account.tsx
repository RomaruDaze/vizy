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
      console.log('Attempting to logout...');
      await logout();
      console.log('Logout successful, redirecting...');
      // Redirect to login page after logout
      window.location.href = '/vizy/login';
    } catch (error) {
      console.error("Failed to log out:", error);
      alert('Failed to logout. Please try again.');
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
        <h2>Account Information</h2>

        {currentUser ? (
          <div className="user-info">
            <div className="user-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="user-details">
              <h3>{currentUser.displayName || "User"}</h3>
              <p>{currentUser.email}</p>
              <p className="user-id">ID: {currentUser.uid}</p>
            </div>

            <div className="account-actions">
              <button 
                className="logout-button" 
                onClick={handleLogout}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/logout.png"
                  alt="Logout"
                  style={{ width: '20px', height: '20px', marginRight: '8px' }}
                />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="no-user">
            <p>Please log in to view account information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
