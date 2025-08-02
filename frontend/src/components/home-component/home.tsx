import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./home.styles.css";
import UserProfile from "./user-profile";
import Account from "../settings-component/account-components/account";
import GettingStarted from "./getting-started";
import VisaStatus from "./visa-status";
import BottomNavigation from "../shared/bottom-navigation";
import { useAuth } from "../../contexts/AuthContext";
import { getUserProfile } from "../../services/userProfileService";

const Home = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [showAccount, setShowAccount] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any> | null>(
    null
  );
  const [shouldOpenReminder, setShouldOpenReminder] = useState(false);
  const [shouldOpenDocumentChecklist, setShouldOpenDocumentChecklist] =
    useState(false);

  // Check if we should open the reminder popup
  useEffect(() => {
    const openReminder = localStorage.getItem("openReminder");

    if (openReminder === "true") {
      setShouldOpenReminder(true);
      // Clear the localStorage flag
      localStorage.removeItem("openReminder");
    }
  }, []);

  // Check if we should open the document checklist popup
  useEffect(() => {
    const openDocumentChecklist = localStorage.getItem("openDocumentChecklist");

    if (openDocumentChecklist === "true") {
      setShouldOpenDocumentChecklist(true);
      // Clear the localStorage flag
      localStorage.removeItem("openDocumentChecklist");
    }
  }, []);

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile && Object.keys(profile).length > 0) {
            setUserAnswers(profile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };

    loadUserProfile();
  }, [currentUser]);

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

  // Reset the reminder flag after passing it to VisaStatus
  const handleReminderOpened = () => {
    setShouldOpenReminder(false);
  };

  // Reset the document checklist flag after passing it to VisaStatus
  const handleDocumentChecklistOpened = () => {
    setShouldOpenDocumentChecklist(false);
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
            openReminderOnMount={shouldOpenReminder}
            onReminderOpened={handleReminderOpened}
            openDocumentChecklistOnMount={shouldOpenDocumentChecklist}
            onDocumentChecklistOpened={handleDocumentChecklistOpened}
          />
        ) : (
          <div className="getting-started-card">
            <div className="getting-started-content">
              <h2>{t("welcome")}</h2>
              <p>{t("getting_started_message")}</p>
              <button
                className="getting-started-button"
                onClick={handleGettingStartedClick}
              >
                {t("get_started")}
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
