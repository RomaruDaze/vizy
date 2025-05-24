import React from "react";
import "./reminder-styles.css";

const Reminder = () => {
  return (
    <div className="reminder-container">
      <div className="reminder-card">
        {/* Title bar */}
        <div className="reminder-title">
          <h5>Reminder</h5>
        </div>

        {/* Content area */}
        <div className="reminder-content">
          <div className="reminder-date">
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminder;
