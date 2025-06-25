import { useState } from "react";
import "./reminder.styles.css";
import ReminderSet from "./reminder-set-component/reminder-set";

const Reminder = () => {
  const [deadlineDate, setDeadlineDate] = useState("2025/06/03");
  const [reminderTime, setReminderTime] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

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
      return { status: "Expired", isAvailable: false };
    }

    if (isWithinThreeMonths(deadlineDate)) {
      return { status: "Available", isAvailable: true };
    }

    return { status: "Unavailable", isAvailable: false };
  };

  // Get current status
  const { status } = getAvailabilityStatus(deadlineDate);

  const handleDeadlineChange = (newDeadline: string, newReminder: string) => {
    setDeadlineDate(newDeadline);
    setReminderTime(newReminder);
    setIsOpen(false);
  };

  return (
    <div className="reminder-container" style={{ position: "relative" }}>
      <div
        className="reminder-card"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
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
          <div className="reminder-time-container">
            <p>Reminder: </p>
            <p className={`reminder-time ${reminderTime ? "set" : "not-set"}`}>
              {reminderTime
                ? `${reminderTime} month${
                    reminderTime === "1" ? "" : "s"
                  } prior`
                : "Not set"}
            </p>
          </div>
          <div className="availability-status-container">
            <p>Status: </p>
            <p
              className={`availability-status ${
                status === "Available"
                  ? "available"
                  : status === "Expired"
                  ? "expired"
                  : "unavailable"
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
      {isOpen && (
        <ReminderSet
          onDeadlineChange={handleDeadlineChange}
          onClose={() => setIsOpen(false)}
          currentDate={deadlineDate}
          currentReminder={reminderTime}
        />
      )}
    </div>
  );
};

export default Reminder;
