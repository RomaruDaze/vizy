import React, { useState, useEffect } from "react";
import { notificationService } from "../services/notificationService";
import "./NotificationTest.styles.css";

const NotificationTest = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    setStatus("Initializing notifications...");
    const success = await notificationService.initialize();
    setIsInitialized(success);
    setStatus(success ? "Ready to send notifications" : "Failed to initialize");
  };

  const startNotifications = () => {
    notificationService.startTestNotifications();
    setIsRunning(true);
    setStatus("Sending notifications every 10 seconds...");
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
    await notificationService.testBasicNotification();
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
          Start 10-Second Test
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
            Click "Start 10-Second Test" to send notifications every 10 seconds
          </li>
          <li>Click "Stop Test" to stop the automatic notifications</li>
          <li>Notifications will appear even when the app is closed</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTest;
