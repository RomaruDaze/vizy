import React, { useState } from "react";
import "./reminder-set.styles.css";

interface ReminderSetProps {
  onDeadlineChange: (newDeadline: string, newReminder: string) => void;
  onClose: () => void;
  currentDate: string;
  currentReminder: string;
}

const ReminderSet: React.FC<ReminderSetProps> = ({
  onDeadlineChange,
  onClose,
  currentDate,
  currentReminder,
}) => {
  const [currentYear, currentMonth, currentDay] = currentDate
    .split("/")
    .map(Number);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedReminder, setSelectedReminder] = useState(currentReminder);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year <= currentYear + 5; year++) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  const generateMonthOptions = () => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      const monthName = new Date(2000, month - 1).toLocaleString("default", {
        month: "long",
      });
      months.push(
        <option key={month} value={month}>
          {monthName}
        </option>
      );
    }
    return months;
  };

  const generateDayOptions = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <option key={day} value={day}>
          {day}
        </option>
      );
    }
    return days;
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const formattedDate = `${selectedYear}/${String(selectedMonth).padStart(
      2,
      "0"
    )}/${String(selectedDay).padStart(2, "0")}`;
    onDeadlineChange(formattedDate, selectedReminder);
    onClose();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="reminder-set-container">
      <div className="reminder-set-popup">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="popup-content">
          <h3>Set Visa Deadline</h3>
          <div className="input-group">
            <div className="input-with-button">
              <label className="date-label">Set Visa expiration date</label>
              <div className="date-selectors">
                <select
                  className="date-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {generateYearOptions()}
                </select>
                <select
                  className="date-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {generateMonthOptions()}
                </select>
                <select
                  className="date-select"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                >
                  {generateDayOptions()}
                </select>
              </div>
            </div>
            <div className="reminder-input-container">
              <label className="reminder-label">Set Reminder</label>
              <select
                className="reminder-select"
                value={selectedReminder}
                onChange={(e) => setSelectedReminder(e.target.value)}
              >
                <option value="">Select reminder time</option>
                <option value="3">3 months prior</option>
                <option value="2">2 months prior</option>
                <option value="1">1 month prior</option>
              </select>
            </div>
            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Confirm Date</h3>
            <p>
              Are you sure you want to set the visa expiration date to{" "}
              {`${selectedYear}/${String(selectedMonth).padStart(
                2,
                "0"
              )}/${String(selectedDay).padStart(2, "0")}`}
              ?
            </p>
            {selectedReminder ? (
              <p className="reminder-info">
                You will be reminded{" "}
                <span className="reminder-time">
                  {selectedReminder} month{selectedReminder === "1" ? "" : "s"}
                </span>{" "}
                before the expiration date.
              </p>
            ) : (
              <p className="reminder-warning">
                You have not set any reminder. Are you sure you don't want to be
                reminded before the expiration date?
              </p>
            )}
            <div className="button-group">
              <button onClick={handleConfirm} className="confirm-btn">
                Confirm
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderSet;
