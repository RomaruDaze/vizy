import { useState } from "react";
import "./visa-status.styles.css";

interface VisaStatusProps {
  answers: Record<string, any>;
  onBack: () => void;
}

interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  checked: boolean;
}

const VisaStatus = ({ answers, onBack }: VisaStatusProps) => {
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderSet, setReminderSet] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "passport", name: "Passport", required: true, checked: false },
    {
      id: "birthCertificate",
      name: "Birth Certificate",
      required: true,
      checked: false,
    },
    {
      id: "educationalCertificates",
      name: "Educational Certificates",
      required: true,
      checked: false,
    },
    {
      id: "employmentRecords",
      name: "Employment Records",
      required: true,
      checked: false,
    },
    {
      id: "financialStatements",
      name: "Financial Statements",
      required: true,
      checked: false,
    },
    {
      id: "medicalRecords",
      name: "Medical Records",
      required: true,
      checked: false,
    },
    {
      id: "policeClearance",
      name: "Police Clearance",
      required: true,
      checked: false,
    },
  ]);

  // Initialize documents based on user answers
  useState(() => {
    if (answers.documents) {
      const updatedDocuments = documents.map((doc) => ({
        ...doc,
        checked: answers.documents.includes(doc.name),
      }));
      setDocuments(updatedDocuments);
    }
  });

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

  const handleSaveDocuments = () => {
    setShowDocumentsPopup(false);
    console.log("Documents saved:", documents);
  };

  const getDeadlineStatus = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    if (deadlineDate < today) {
      return { status: "expired", message: "Deadline has expired" };
    } else if (deadlineDate <= threeMonthsFromNow) {
      return {
        status: "available",
        message: "Available for submission",
      };
    } else {
      return {
        status: "not-available",
        message: "Not available for submission",
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

  const handleSetReminder = () => {
    if (reminderDate && reminderTime) {
      setReminderSet(true);
      setShowReminderPopup(false);
      console.log("Reminder set for:", reminderDate, reminderTime);
    }
  };

  const handleClearReminder = () => {
    setReminderSet(false);
    setReminderDate("");
    setReminderTime("");
    setShowReminderPopup(false);
  };

  const handleCloseReminderPopup = () => {
    setShowReminderPopup(false);
    // Don't clear the reminder data when just closing the popup
    // Only clear when explicitly clicking "Clear Reminder"
  };

  const formatReminderDateTime = () => {
    if (!reminderDate || !reminderTime) return "";

    const date = new Date(`${reminderDate}T${reminderTime}`);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getReminderButtonText = () => {
    if (reminderSet && reminderDate && reminderTime) {
      return `Reminder: ${formatReminderDateTime()}`;
    }
    return "Set Reminder";
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
          <h2>Your Visa Deadline</h2>
        </div>
        <div className="deadline-date">
          {answers.deadline
            ? new Date(answers.deadline).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No deadline set"}
        </div>
        <div
          className={`deadline-availability ${deadlineStatus?.status || ""}`}
        >
          <p>{deadlineStatus?.message || "No deadline set"}</p>
          {deadlineStatus && (
            <img
              src={getStatusIcon(deadlineStatus.status)}
              alt={deadlineStatus.status}
              className="status-icon"
            />
          )}
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
            <h3>Incomplete Documents</h3>
            <p>{getIncompleteCount()} documents remaining</p>
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
                  src="https://img.icons8.com/ios-filled/100/FFFFFF/back.png"
                  alt="Close"
                />
              </button>
              <h3>Document Checklist</h3>
            </div>

            <div className="documents-list">
              {documents.map((doc) => (
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

            <div className="documents-actions">
              <button className="save-button" onClick={handleSaveDocuments}>
                Save Changes
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
                  src="https://img.icons8.com/ios-filled/100/FFFFFF/back.png"
                  alt="Close"
                />
              </button>
              <h3>Set Reminder</h3>
            </div>

            <div className="reminder-form">
              <div className="form-group">
                <label>Reminder Date</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-group">
                <label>Reminder Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>

              <div className="reminder-actions">
                <button className="clear-button" onClick={handleClearReminder}>
                  Clear Reminder
                </button>
                <button
                  className="set-button"
                  onClick={handleSetReminder}
                  disabled={!reminderDate || !reminderTime}
                >
                  Set Reminder
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
