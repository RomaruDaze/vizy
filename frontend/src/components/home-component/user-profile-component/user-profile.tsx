import { useAuth } from "../../../contexts/AuthContext";
import "./user-profile.styles.css";

const UserProfile = () => {
  const { currentUser } = useAuth();

  // Get the user's display name or first letter of email as fallback
  const getUserDisplayName = () => {
    // First priority: displayName (set during signup)
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    // Second priority: email username (part before @)
    if (currentUser?.email) {
      return currentUser.email.split("@")[0];
    }
    // Fallback
    return "User";
  };

  // Get the first letter for the avatar
  const getAvatarLetter = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <div className="user-profile">
      <div className="profile-picture">
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar-placeholder">{getAvatarLetter()}</div>
        )}
      </div>
      <div className="user-info">
        <h2 className="user-name">{getUserDisplayName()}</h2>
        <p className="user-status">Welcome back!</p>
      </div>
    </div>
  );
};

export default UserProfile;
