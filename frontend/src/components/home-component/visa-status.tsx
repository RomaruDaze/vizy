import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/userProfileService";
import {
  generateDocuments,
  type DocumentItem,
} from "../../services/documentService";
import {
  getUserReminders,
  createReminder,
  deleteReminder,
  toggleReminderComplete,
} from "../../services/reminderService";
import type { Reminder } from "../../types/userProfile";
import { requestNotificationPermission } from "../../services/notificationService";

interface VisaStatusProps {
  answers: Record<string, any>;
  openReminderOnMount?: boolean;
  onReminderOpened?: () => void;
  openDocumentChecklistOnMount?: boolean;
  onDocumentChecklistOpened?: () => void;
}

const VisaStatus = ({
  answers,
  openReminderOnMount = false,
  onReminderOpened,
  openDocumentChecklistOnMount = false,
  onDocumentChecklistOpened,
}: VisaStatusProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (openReminderOnMount) {
      setShowReminderPopup(true);
      if (onReminderOpened) {
        onReminderOpened();
      }
    }
  }, [openReminderOnMount, onReminderOpened]);

  useEffect(() => {
    if (openDocumentChecklistOnMount) {
      setShowDocumentsPopup(true);
      if (onDocumentChecklistOpened) {
        onDocumentChecklistOpened();
      }
    }
  }, [openDocumentChecklistOnMount, onDocumentChecklistOpened]);

  useEffect(() => {
    const loadSavedData = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            let targetVisaType = null;

            if (profile.purpose === "Extend current residency") {
              targetVisaType = profile.ResidencyType;
            } else if (
              profile.purpose === "Change to a different Residency type"
            ) {
              targetVisaType = profile.purpose_target;
            }

            if (targetVisaType) {
              const generatedDocuments = generateDocuments(targetVisaType);

              // Check if we need to sync documents with documentProgress
              if (
                profile.documents &&
                profile.documents.length > 0 &&
                (!profile.documentProgress ||
                  Object.keys(profile.documentProgress).length === 0)
              ) {
                // Create documentProgress based on the documents array
                const documentProgress: { [key: string]: boolean } = {};

                generatedDocuments.forEach((doc) => {
                  // Check if this document exists in the user's documents array
                  const isSelected = profile.documents!.some((selectedDoc) => {
                    // Create a mapping for common document name variations
                    const documentMapping: { [key: string]: string[] } = {
                      application: [
                        "application extension form",
                        "application form",
                        "extension form",
                      ],
                      passport: ["passport"],
                      residenceCard: ["residence card", "residency card"],
                      idPhoto: [
                        "id photo",
                        "photo",
                        "id photo (3x4 cm)",
                        "3x4 cm photo",
                      ],
                      processingFee: [
                        "processing fee",
                        "fee",
                        "application fee",
                      ],
                      certificateOfEmployment: [
                        "certificate of employment",
                        "employment certificate",
                      ],
                      companyFinancial: [
                        "company financial",
                        "financial documents",
                      ],
                      companyRegistration: [
                        "company registration",
                        "registration",
                      ],
                      residentTax: ["resident tax", "tax"],
                      taxPayment: ["tax payment", "tax receipt"],
                    };

                    const docName = doc.name.toLowerCase();
                    const selectedDocName = selectedDoc.toLowerCase();

                    // Check if this document has a mapping
                    if (documentMapping[doc.id]) {
                      return documentMapping[doc.id].some(
                        (mappedName) =>
                          selectedDocName.includes(mappedName) ||
                          mappedName.includes(selectedDocName)
                      );
                    }

                    // Fallback to direct matching
                    return (
                      docName.includes(selectedDocName) ||
                      selectedDocName.includes(docName)
                    );
                  });

                  documentProgress[doc.id] = isSelected;
                });

                // Save the documentProgress to Firebase
                await updateUserProfile(currentUser.uid, {
                  documentProgress,
                });

                // Update local state with the synced data
                const updatedDocuments = generatedDocuments.map((doc) => ({
                  ...doc,
                  checked: documentProgress[doc.id] || false,
                }));
                setDocuments(updatedDocuments);
              } else if (profile.documentProgress) {
                // Use existing documentProgress
                const updatedDocuments = generatedDocuments.map((doc) => ({
                  ...doc,
                  checked: profile.documentProgress![doc.id] || false,
                }));
                setDocuments(updatedDocuments);
              } else {
                // No documents or progress, set all as unchecked
                setDocuments(generatedDocuments);
              }
            }
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
    };

    loadSavedData();
  }, [currentUser]);

  useEffect(() => {
    const loadReminders = async () => {
      if (currentUser) {
        try {
          const userReminders = await getUserReminders(currentUser.uid);
          setReminders(userReminders);
        } catch (error) {
          console.error("Error loading reminders:", error);
        }
      }
    };

    loadReminders();
  }, [currentUser]);

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
    // Request notification permission when popup opens
    requestNotificationPermission();
  };

  const handleCloseReminderPopup = () => {
    setShowReminderPopup(false);
    setNewReminder({ title: "", date: "", time: "" });
  };

  const handleCreateReminder = async () => {
    if (
      newReminder.title &&
      newReminder.date &&
      newReminder.time &&
      currentUser
    ) {
      try {
        // Ensure notification permission is granted before creating reminder
        const permissionGranted = await requestNotificationPermission();

        if (!permissionGranted) {
          alert("Please enable notifications to receive reminder alerts!");
          return;
        }

        await createReminder(currentUser.uid, {
          ...newReminder,
          description: "", // Set empty description
          completed: false,
        });

        const userReminders = await getUserReminders(currentUser.uid);
        setReminders(userReminders);
        setNewReminder({ title: "", date: "", time: "" });

        // Show confirmation
        alert(
          "Reminder created successfully! You'll receive notifications when it's due."
        );
      } catch (error) {
        console.error("Error creating reminder:", error);
        alert("Error creating reminder. Please try again.");
      }
    }
  };

  const handleToggleReminder = async (
    reminderId: string,
    completed: boolean
  ) => {
    if (currentUser) {
      try {
        await toggleReminderComplete(currentUser.uid, reminderId, completed);
        setReminders((prev) =>
          prev.map((reminder) =>
            reminder.id === reminderId ? { ...reminder, completed } : reminder
          )
        );
      } catch (error) {
        console.error("Error updating reminder:", error);
      }
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (currentUser) {
      try {
        await deleteReminder(currentUser.uid, reminderId);
        setReminders((prev) =>
          prev.filter((reminder) => reminder.id !== reminderId)
        );
      } catch (error) {
        console.error("Error deleting reminder:", error);
      }
    }
  };

  const handleHelpClick = () => {
    navigate("/user-guide");
  };

  const groupedDocuments = documents.reduce((groups, doc) => {
    const category = doc.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {} as Record<string, DocumentItem[]>);

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
          <button className="reminder-button" onClick={handleReminderClick}>
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/bell.png"
              alt="Reminder"
              className="reminder-icon"
            />
            {t("view_reminders")}
          </button>
        </div>
      </div>

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
              <h3>{t("reminders")}</h3>
            </div>

            <div className="reminder-content">
              {reminders.length === 0 ? (
                <div className="no-reminders">
                  <p>{t("no_reminders_set")}</p>
                </div>
              ) : (
                <div className="reminders-list">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`reminder-item ${
                        reminder.completed ? "completed" : ""
                      }`}
                    >
                      <div className="reminder-header">
                        <label className="reminder-checkbox">
                          <input
                            type="checkbox"
                            checked={reminder.completed}
                            onChange={(e) =>
                              handleToggleReminder(
                                reminder.id,
                                e.target.checked
                              )
                            }
                          />
                          <span className="checkmark"></span>
                        </label>
                        <div className="reminder-info">
                          <h4 className={reminder.completed ? "completed" : ""}>
                            {reminder.title}
                          </h4>
                          <p className={reminder.completed ? "completed" : ""}>
                            {reminder.description}
                          </p>
                          <span className="reminder-date">
                            {reminder.date} at {reminder.time}
                          </span>
                        </div>
                        <button
                          className="delete-reminder-btn"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <img
                            src="https://img.icons8.com/ios-glyphs/100/FFFFFF/delete.png"
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="add-reminder-form">
                <h4>{t("add_new_reminder")}</h4>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder={t("reminder_title")}
                    value={newReminder.title}
                    onChange={(e) =>
                      setNewReminder((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      className="reminder-date-input"
                      type="date"
                      value={newReminder.date}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="reminder-time-input"
                      type="time"
                      value={newReminder.time}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  className="add-reminder-btn"
                  onClick={handleCreateReminder}
                  disabled={
                    !newReminder.title || !newReminder.date || !newReminder.time
                  }
                >
                  {t("add_reminder")}
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
