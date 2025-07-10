import { useState } from "react";
import "./visa-status.styles.css";

interface VisaStatusProps {
  answers: Record<string, any>;
  onBack: () => void;
}

const VisaStatus = ({ answers, onBack }: VisaStatusProps) => {
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
        message: "Make sure to complete all requirements before this date",
      };
    } else {
      return {
        status: "not-available",
        message: "You have more than 3 months remaining",
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

  const handleIncompleteDocuments = () => {
    // TODO: Navigate to documents page or show document checklist
    console.log("Navigate to incomplete documents");
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
      </div>

      {/* Bottom Card - Incomplete Documents */}
      <div className="documents-card" onClick={handleIncompleteDocuments}>
        <div className="documents-content">
          <div className="documents-icon">📋</div>
          <div className="documents-text">
            <h3>Incomplete Documents</h3>
            <p>Review and complete missing requirements</p>
          </div>
          <div className="documents-arrow">→</div>
        </div>
      </div>
    </div>
  );
};

export default VisaStatus;
