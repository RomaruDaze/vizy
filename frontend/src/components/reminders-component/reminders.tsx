import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getUserReminders,
  createReminder,
  deleteReminder,
  toggleReminderComplete,
  type Reminder,
} from "../../services/reminderService";
import { requestNotificationPermission } from "../../services/notificationService";
import "./reminders.styles.css";

const Reminders = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (currentUser) {
      const loadReminders = async () => {
        try {
          const userReminders = await getUserReminders(currentUser.uid);
          setReminders(userReminders);
        } catch (error) {
          console.error("Error loading reminders:", error);
        }
      };
      loadReminders();
    }
  }, [currentUser]);

  const handleCreateReminder = async () => {
    if (
      currentUser &&
      newReminder.title &&
      newReminder.date &&
      newReminder.time
    ) {
      try {
        // Ensure notification permission is granted before creating reminder
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          alert("Please enable notifications to receive reminder alerts!");
          return;
        }

        await createReminder(currentUser.uid, {
          ...newReminder,
          completed: false,
        });

        const userReminders = await getUserReminders(currentUser.uid);
        setReminders(userReminders);
        setNewReminder({ title: "", description: "", date: "", time: "" });

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

  return (
    <div className="reminders-page">
      <div className="reminders-container">
        <div className="reminders-header">
          <h1>{t("reminders")}</h1>
        </div>

        <div className="reminders-content">
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
                          handleToggleReminder(reminder.id, e.target.checked)
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
                    <div className="reminder-info">
                      <h4 className={reminder.completed ? "completed" : ""}>
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p className={reminder.completed ? "completed" : ""}>
                          {reminder.description}
                        </p>
                      )}
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
            <div className="form-group">
              <textarea
                placeholder={t("reminder_description")}
                value={newReminder.description}
                onChange={(e) =>
                  setNewReminder((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
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
  );
};

export default Reminders;
