import React from "react";
import "./user-profile.styles.css";

const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="profile-picture">
        <img
          src="/default-avatar.png"
          alt="User Profile"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='20' fill='%23ccc'/%3E%3Cpath d='M20 85c0-16.6 13.4-30 30-30s30 13.4 30 30' fill='%23ccc'/%3E%3C/svg%3E";
          }}
        />
      </div>
      <div className="user-info">
        <h2 className="user-name">User Name</h2>
        <p className="user-status">Welcome back!</p>
      </div>
    </div>
  );
};

export default UserProfile;
