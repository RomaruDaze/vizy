import "./user-profile.styles.css";

const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="profile-picture">
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/user.png"
          alt="user"
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
