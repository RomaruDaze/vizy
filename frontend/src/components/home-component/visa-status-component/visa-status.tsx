import { useState } from "react";
import "./visa-status.styles.css";

interface VisaStatusProps {
  answers: Record<string, any>;
  onBack: () => void;
}

const VisaStatus = ({ answers, onBack }: VisaStatusProps) => {
  const handleIncompleteDocuments = () => {
    // TODO: Navigate to documents page or show document checklist
    console.log("Navigate to incomplete documents");
  };

  return (
    <div className="visa-status-container">
      {/* Top Card - Deadline */}
      <div className="deadline-card">
        <div className="deadline-header">
          <h2>Your Visa Deadline</h2>
          <div className="deadline-icon">⏰</div>
        </div>
        <div className="deadline-date">
          {answers.deadline ? new Date(answers.deadline).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'No deadline set'}
        </div>
        <div className="deadline-info">
          <p>Make sure to complete all requirements before this date</p>
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