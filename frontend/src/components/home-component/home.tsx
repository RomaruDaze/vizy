import { useState } from "react";
import "./home.styles.css";
import UserProfile from "./user-profile-component/user-profile";
import Account from "../settings-component/account-components/account";
import GettingStarted from "./getting-started-component/getting-started";
import VisaStatus from "./visa-status-component/visa-status";
import BottomNavigation from "../shared/bottom-navigation";

const Home = () => {
  const [showAccount, setShowAccount] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any> | null>(
    null
  );

  const handleAccountClick = () => {
    setShowAccount(true);
  };

  const handleBackFromAccount = () => {
    setShowAccount(false);
  };

  const handleGettingStartedClick = () => {
    setShowGettingStarted(true);
  };

  const handleBackFromGettingStarted = () => {
    setShowGettingStarted(false);
  };

  const handleGettingStartedComplete = (answers: Record<string, any>) => {
    setUserAnswers(answers);
    setShowGettingStarted(false);
  };

  if (showAccount) {
    return <Account onBack={handleBackFromAccount} />;
  }

  if (showGettingStarted) {
    return (
      <GettingStarted
        onBack={handleBackFromGettingStarted}
        onComplete={handleGettingStartedComplete}
      />
    );
  }

  return (
    <div className="home-container">
      {/* Top section - User Profile (15%) */}
      <div className="top-section">
        <UserProfile onAccountClick={handleAccountClick} />
      </div>

      {/* Middle section - Getting Started or Visa Status (85%) */}
      <div className="middle-section">
        {userAnswers ? (
          <VisaStatus
            answers={userAnswers}
            onBack={() => setUserAnswers(null)}
          />
        ) : (
          <div className="getting-started-card">
            <div className="getting-started-content">
              <h2>Welcome to Vizy</h2>
              <p>
                Let's get you started on your visa journey. We'll ask a few
                questions to personalize your experience.
              </p>
              <button
                className="getting-started-button"
                onClick={handleGettingStartedClick}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section - Navigation (10%) */}
      <div className="bottom-section">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Home;
