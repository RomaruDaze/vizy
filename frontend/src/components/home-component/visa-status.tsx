import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getUserProfile,
  updateUserProfile, // Changed from updateUserLanguage
} from "../../services/userProfileService";
import {
  generateDocuments,
  type DocumentItem,
} from "../../services/documentService";

interface VisaStatusProps {
  answers: Record<string, any>;
  openReminderOnMount?: boolean; // Add this prop
  onReminderOpened?: () => void; // Add callback prop
}

const VisaStatus = ({
  answers,
  openReminderOnMount = false,
  onReminderOpened,
}: VisaStatusProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderSet, setReminderSet] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Add effect to open reminder popup on mount if requested
  useEffect(() => {
    if (openReminderOnMount) {
      setShowReminderPopup(true);
      // Call the callback to notify parent that reminder was opened
      if (onReminderOpened) {
        onReminderOpened();
      }
    }
  }, [openReminderOnMount, onReminderOpened]);

  // Load saved data from Firebase
  useEffect(() => {
    const loadSavedData = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setReminderDate(profile.reminderDate || "");
            setReminderTime(profile.reminderTime || "");
            setReminderSet(profile.reminderSet || false);

            // Determine target visa type based on purpose
            let targetVisaType = null;

            if (profile.purpose === "Extend current residency") {
              targetVisaType = profile.ResidencyType;
            } else if (
              profile.purpose === "Change to a different Residency type"
            ) {
              targetVisaType = profile.purpose_target;
            }

            if (targetVisaType) {
              // Generate documents based on target visa type
              const generatedDocuments = generateDocuments(targetVisaType);

              // Load document progress
              if (profile.documentProgress) {
                const updatedDocuments = generatedDocuments.map((doc) => ({
                  ...doc,
                  checked: profile.documentProgress![doc.id] || false,
                }));
                setDocuments(updatedDocuments);
              } else {
                setDocuments(generatedDocuments);
              }
            } else {
              console.error("No target visa type found in profile");
            }
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
    };

    loadSavedData();
  }, [currentUser]);

  // Update documents when visa type changes
  useEffect(() => {
    if (answers.purpose) {
      let targetVisaType = "Work Visa";

      if (answers.purpose === "Extend current residency") {
        targetVisaType = answers.ResidencyType || "Work Visa";
      } else if (answers.purpose === "Change to different residency type") {
        targetVisaType = answers.purpose_target || "Work Visa";
      }

      const generatedDocuments = generateDocuments(targetVisaType);
      setDocuments(generatedDocuments);
    }
  }, [answers.purpose, answers.ResidencyType, answers.purpose_target]);

  const getIncompleteCount = () => {
    return documents.filter((doc) => !doc.checked).length;
  };

  const handleDocumentToggle = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, checked: !doc.checked } : doc
      )
    );
  };

  const handleDocumentsClick = () => {
    setShowDocumentsPopup(true);
  };

  const handleCloseDocumentsPopup = () => {
    setShowDocumentsPopup(false);
  };

  const handleSaveDocuments = async () => {
    if (currentUser) {
      const documentProgress: { [key: string]: boolean } = {};
      documents.forEach((doc) => {
        documentProgress[doc.id] = doc.checked;
      });

      await updateUserProfile(currentUser.uid, {
        documentProgress,
      });

      setShowDocumentsPopup(false);
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    if (deadlineDate < today) {
      return { status: "expired", message: t("deadline_expired") };
    } else if (deadlineDate <= threeMonthsFromNow) {
      return {
        status: "available",
        message: t("available_for_submission"),
      };
    } else {
      return {
        status: "not-available",
        message: t("not_available_for_submission"),
      };
    }
  };

  const deadlineStatus = answers.deadline
    ? getDeadlineStatus(answers.deadline)
    : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "https://img.icons8.com/ios-glyphs/100/FFFFFF/checked--v1.png";
      case "not-available":
        return "https://img.icons8.com/ios-filled/100/FFFFFF/clock--v1.png";
      case "expired":
        return "https://img.icons8.com/ios-filled/100/FFFFFF/warning-shield.png";
      default:
        return "";
    }
  };

  const handleReminderClick = () => {
    setShowReminderPopup(true);
  };

  const handleSetReminder = async () => {
    if (reminderDate && reminderTime && currentUser) {
      setReminderSet(true);
      setShowReminderPopup(false);

      // Save to Firebase
      await updateUserProfile(currentUser.uid, {
        reminderDate,
        reminderTime,
        reminderSet: true,
      });
    }
  };

  const handleClearReminder = async () => {
    if (currentUser) {
      setReminderSet(false);
      setReminderDate("");
      setReminderTime("");
      setShowReminderPopup(false);

      // Save to Firebase
      await updateUserProfile(currentUser.uid, {
        reminderDate: "",
        reminderTime: "",
        reminderSet: false,
      });
    }
  };

  const getReminderButtonText = () => {
    if (reminderSet) {
      return `Reminder set for ${reminderDate} at ${reminderTime}`;
    }
    return t("set_reminder");
  };

  const handleCloseReminderPopup = () => {
    setShowReminderPopup(false);
  };

  const handleHelpClick = () => {
    navigate("/user-guide");
  };

  // Group documents by category
  const groupedDocuments = documents.reduce((groups, doc) => {
    const category = doc.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {} as Record<string, DocumentItem[]>);

  // Function to format date based on language
  const formatDate = (date: Date) => {
    if (language === "ja") {
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="visa-status-container">
      {/* Top Card - Deadline */}
      <div className="deadline-card">
        <div className="deadline-header">
          <img
            src="https://img.icons8.com/ios-filled/100/FFFFFF/overtime.png"
            alt="Deadline"
          />
          <h2>{t("your_residency_deadline")}</h2>
        </div>

        <div
          className={`deadline-availability ${deadlineStatus?.status || ""}`}
        >
          <div className="deadline-date">
            {answers.deadline
              ? formatDate(new Date(answers.deadline))
              : t("no_deadline_set")}
          </div>
          <div className="deadline-status">
            <p>{deadlineStatus?.message || t("no_deadline_set")}</p>
            {deadlineStatus && (
              <img
                src={getStatusIcon(deadlineStatus.status)}
                alt={deadlineStatus.status}
                className="status-icon"
              />
            )}
          </div>
        </div>
        <div className="deadline-reminder">
          <button
            className={`reminder-button ${reminderSet ? "reminder-set" : ""}`}
            onClick={handleReminderClick}
          >
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/bell.png"
              alt="Reminder"
              className="reminder-icon"
            />
            {getReminderButtonText()}
          </button>
        </div>
      </div>

      {/* Bottom Card - Incomplete Documents */}
      <div className="documents-card" onClick={handleDocumentsClick}>
        <div className="documents-content">
          <div className="documents-icon">
            <img
              src="https://img.icons8.com/ios-glyphs/100/FFFFFF/ingredients-list.png"
              alt="Documents"
            />
          </div>
          <div className="documents-text">
            <h3>{t("incomplete_documents")}</h3>
            <p>
              {getIncompleteCount()} {t("documents_remaining")}
            </p>
          </div>
          <div className="documents-arrow">→</div>
        </div>
      </div>

      {/* Documents Popup */}
      {showDocumentsPopup && (
        <div
          className="documents-popup-overlay"
          onClick={handleCloseDocumentsPopup}
        >
          <div
            className="documents-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="documents-popup-header">
              <button
                className="close-button"
                onClick={handleCloseDocumentsPopup}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Back"
                />
              </button>
              <h3>{t("document_checklist")}</h3>
              <button
                className="documents-help-button"
                onClick={handleHelpClick}
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/100/FFFFFF/help.png"
                  alt="Help"
                />
              </button>
            </div>

            <div className="documents-list">
              {Object.entries(groupedDocuments).map(([category, docs]) => (
                <div key={category} className="document-category">
                  <h4 className="category-title">{category}</h4>
                  {docs.map((doc) => (
                    <div key={doc.id} className="document-item">
                      <label className="document-checkbox">
                        <input
                          type="checkbox"
                          checked={doc.checked}
                          onChange={() => handleDocumentToggle(doc.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="document-name">{doc.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="documents-actions">
              <button
                className="save-button-documents"
                onClick={handleSaveDocuments}
              >
                {t("save_changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Popup */}
      {showReminderPopup && (
        <div
          className="reminder-popup-overlay"
          onClick={handleCloseReminderPopup}
        >
          <div
            className="reminder-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reminder-popup-header">
              <button
                className="close-button"
                onClick={handleCloseReminderPopup}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Back"
                />
              </button>
              <h3>{t("set_reminder")}</h3>
            </div>
            <div className="reminder-form">
              <div className="form-group">
                <label>{t("date")}</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>{t("time")}</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <div className="reminder-actions">
                <button className="clear-button" onClick={handleClearReminder}>
                  {t("clear_reminder")}
                </button>
                <button
                  className="set-button"
                  onClick={handleSetReminder}
                  disabled={!reminderDate || !reminderTime}
                >
                  {t("set_reminder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaStatus;
