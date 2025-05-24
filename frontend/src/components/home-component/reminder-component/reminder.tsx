import React from "react";
import "./reminder.styles.css";

const Reminder = () => {
  // Function to check if date is within 3 months
  const isWithinThreeMonths = (deadlineDate: string) => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    return today <= deadline && deadline <= threeMonthsFromNow;
  };

  // Function to determine availability status
  const getAvailabilityStatus = (deadlineDate: string) => {
    const deadline = new Date(deadlineDate);
    const today = new Date();

    if (today > deadline) {
      return { status: "Unavailable", isAvailable: false };
    }

    if (isWithinThreeMonths(deadlineDate)) {
      return { status: "Available", isAvailable: true };
    }

    return { status: "Unavailable", isAvailable: false };
  };

  const deadlineDate = "2025/06/03";
  const { status, isAvailable } = getAvailabilityStatus(deadlineDate);

  return (
    <div className="reminder-container">
      <div className="reminder-card">
        {/* Title bar */}
        <div className="reminder-title">
          <h5>VISA Renewal Reminder</h5>
        </div>

        {/* Content area */}
        <div className="reminder-content">
          <div className="deadline-date-container">
            <p>Deadline: </p>
            <p className="deadline-date">{deadlineDate}</p>
          </div>
          <div className="availability-status-container">
            <p>Status: </p>
            <p
              className={`availability-status ${
                isAvailable ? "available" : "unavailable"
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminder;
