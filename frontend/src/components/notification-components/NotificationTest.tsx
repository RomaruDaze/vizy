import { useState, useEffect } from "react";
import NotificationService from "../../services/notificationService";
import "./NotificationTest.styles.css";

const NotificationTest = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [notificationService] = useState(() => new NotificationService());

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    setStatus("Initializing notifications...");

    // Check if notifications are supported
    if (!("Notification" in window)) {
      setStatus("Notifications not supported in this browser");
      setIsInitialized(false);
      return;
    }

    // Check permission
    if (Notification.permission === "denied") {
      setStatus("Notification permission denied");
      setIsInitialized(false);
      return;
    }

    // Request permission if needed
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("Notification permission denied");
        setIsInitialized(false);
        return;
      }
    }

    setIsInitialized(true);
    setStatus("Ready to send notifications");
  };

  const startNotifications = () => {
    notificationService.startTestNotifications();
    setIsRunning(true);
    setStatus("Sending notifications every 1 second...");
  };

  const stopNotifications = () => {
    notificationService.stopTestNotifications();
    setIsRunning(false);
    setStatus("Notifications stopped");
  };

  const sendSingleNotification = async () => {
    await notificationService.sendNotification(
      "Single Test Notification",
      "This is a single test notification!"
    );
    setStatus("Single notification sent");
  };

  const testBasicNotification = async () => {
    notificationService.testBasicNotification();
    setStatus("Basic notification sent");
  };

  return (
    <div className="notification-test">
      <h2>Push Notification Test</h2>

      <div className="status-section">
        <p className="status-text">Status: {status}</p>
        <div
          className={`status-indicator ${isInitialized ? "ready" : "error"}`}
        >
          {isInitialized ? "✓ Ready" : "✗ Not Ready"}
        </div>
      </div>

      <div className="controls">
        <button
          className="test-button single"
          onClick={sendSingleNotification}
          disabled={!isInitialized}
        >
          Send Single Notification
        </button>

        <button
          className="test-button start"
          onClick={startNotifications}
          disabled={!isInitialized || isRunning}
        >
          Start 1-Second Test
        </button>

        <button
          className="test-button stop"
          onClick={stopNotifications}
          disabled={!isRunning}
        >
          Stop Test
        </button>

        <button
          className="test-button basic"
          onClick={testBasicNotification}
          disabled={!isInitialized}
        >
          Test Basic Notification
        </button>
      </div>

      <div className="info">
        <h3>How it works:</h3>
        <ul>
          <li>Click "Send Single Notification" to send one notification</li>
          <li>
            Click "Start 1-Second Test" to send notifications every 1 second
          </li>
          <li>Click "Stop Test" to stop the automatic notifications</li>
          <li>Notifications will appear even when the app is closed</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTest;
