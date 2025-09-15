import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect } from "react";

interface UserProfileProps {
  onAccountClick?: () => void;
}

const UserProfile = ({ onAccountClick }: UserProfileProps) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [profileImage, setProfileImage] = useState<string>("");

  // List of available profile pictures in assets/pp/
  const profilePictures = [
    "profile1.png",
    "profile2.png",
  ];

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

  // Select a random profile picture based on user ID for consistency
  useEffect(() => {
    if (currentUser?.uid) {
      // Use the user's UID to generate a consistent "random" selection
      const hash = currentUser.uid.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
      const index = Math.abs(hash) % profilePictures.length;
      setProfileImage(profilePictures[index]);
    }
  }, [currentUser?.uid]);

  const handleClick = () => {
    if (onAccountClick) {
      onAccountClick();
    }
  };

  // Handle image load error
  const handleImageError = () => {
    setProfileImage("");
  };

  return (
    <div className="user-profile" onClick={handleClick}>
      <div className="profile-picture">
        {profileImage ? (
          <img
            src={`/src/assets/pp/${profileImage}`}
            alt="Profile"
            className="profile-avatar"
            onError={handleImageError}
          />
        ) : (
          <div className="profile-avatar-placeholder">{getAvatarLetter()}</div>
        )}
      </div>
      <div className="user-info">
        <h2 className="user-name">{getUserDisplayName()}</h2>
        <p className="user-status">{t("welcome_back")}</p>
      </div>
    </div>
  );
};

export default UserProfile;
