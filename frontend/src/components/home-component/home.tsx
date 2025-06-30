import { useState } from "react";
import "./home.styles.css";
import Reminder from "./reminder-component/reminder";
import Checklist from "./checklist-component/checklist";
import UserProfile from "./user-profile-component/user-profile";
import Account from "../settings-component/account-components/account";
import BottomNavigation from "../shared/bottom-navigation";

const Home = () => {
  const [showAccount, setShowAccount] = useState(false);

  const handleAccountClick = () => {
    setShowAccount(true);
  };

  const handleBackFromAccount = () => {
    setShowAccount(false);
  };

  if (showAccount) {
    return <Account onBack={handleBackFromAccount} />;
  }

  return (
    <div className="home-container">
      {/* Top section - User Profile (15%) */}
      <div className="top-section">
        <UserProfile />
      </div>

      {/* Middle section - Reminder & Checklist (85%) */}
      <div className="middle-section">
        <Reminder />
        <Checklist />
      </div>

      {/* Bottom section - Navigation (10%) */}
      <div className="bottom-section">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Home;
