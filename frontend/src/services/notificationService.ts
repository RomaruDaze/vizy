export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export interface ReminderNotification {
  reminderId: string;
  timeoutId: NodeJS.Timeout;
  nextNotificationTime: Date;
  interval: number; // in minutes
}

// Store active reminder notifications
const activeNotifications = new Map<string, ReminderNotification>();

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    console.log("Notification permission denied");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showNotification = (data: NotificationData): void => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    console.log("Cannot show notification - permission not granted");
    return;
  }

  try {
    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || "/vizy.svg",
      tag: data.tag,
      requireInteraction: true,
      silent: false,
      badge: "/vizy.svg",
      vibrate: [200, 100, 200], // Vibration pattern for mobile
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    notification.onerror = (error) => {
      console.error("Notification error:", error);
    };

    // Auto-close after 15 seconds on mobile
    setTimeout(() => {
      notification.close();
    }, 15000);

    console.log("Notification shown successfully:", data.title);
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

// Alternative notification method for mobile
export const showMobileNotification = (data: NotificationData): void => {
  // Try to show native notification first
  if ("Notification" in window && Notification.permission === "granted") {
    showNotification(data);
    return;
  }

  // Fallback: Show in-app notification or alert
  console.log("Showing fallback notification:", data);

  // Create a visible in-app notification
  const notificationElement = document.createElement("div");
  notificationElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #667eea;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 300px;
    font-family: Arial, sans-serif;
  `;

  notificationElement.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">${data.title}</div>
    <div>${data.body}</div>
  `;

  document.body.appendChild(notificationElement);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notificationElement.parentNode) {
      notificationElement.parentNode.removeChild(notificationElement);
    }
  }, 5000);
};

const calculateNextNotificationTime = (
  currentTime: Date,
  interval: number
): Date => {
  const nextTime = new Date(currentTime);

  // If current time is between 22:00 (10 PM) and 08:00 (8 AM), schedule for 8 AM next day
  if (currentTime.getHours() >= 22 || currentTime.getHours() < 8) {
    nextTime.setDate(nextTime.getDate() + 1);
    nextTime.setHours(8, 0, 0, 0);
  } else {
    // Add interval minutes
    nextTime.setMinutes(nextTime.getMinutes() + interval);

    // If it goes past 22:00, schedule for 8 AM next day
    if (nextTime.getHours() >= 22) {
      nextTime.setDate(nextTime.getDate() + 1);
      nextTime.setHours(8, 0, 0, 0);
    }
  }

  return nextTime;
};

export const scheduleReminderNotification = (reminder: {
  id: string;
  title: string;
  date: string;
  time: string;
}): void => {
  console.log("Scheduling notification for reminder:", reminder);

  const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
  const now = new Date();

  console.log("Reminder date:", reminderDate);
  console.log("Current time:", now);

  // If reminder is in the past, start from now
  const startTime = reminderDate <= now ? now : reminderDate;

  console.log("Start time for notifications:", startTime);

  // Initial interval: 30 minutes
  let interval = 30;

  // First notification should be at the exact reminder time (or now if past)
  let nextNotificationTime = startTime;

  console.log("First notification will be at:", nextNotificationTime);

  const scheduleNextNotification = () => {
    const timeUntilNext = nextNotificationTime.getTime() - Date.now();

    console.log(
      `Scheduling next notification in ${timeUntilNext}ms (${Math.round(
        timeUntilNext / 1000 / 60
      )} minutes)`
    );

    if (timeUntilNext > 0) {
      const timeoutId = setTimeout(() => {
        console.log("Showing notification for reminder:", reminder.title);

        // Try to show notification with fallback
        try {
          showNotification({
            title: "Reminder: " + reminder.title,
            body: `Your reminder is due! (${reminder.date} at ${reminder.time})`,
            tag: `reminder-${reminder.id}`,
          });
        } catch (error) {
          console.log("Native notification failed, showing fallback");
          showMobileNotification({
            title: "Reminder: " + reminder.title,
            body: `Your reminder is due! (${reminder.date} at ${reminder.time})`,
            tag: `reminder-${reminder.id}`,
          });
        }

        // Schedule next notification with increased interval
        interval = Math.min(interval * 1.5, 120); // Max 2 hours
        nextNotificationTime = calculateNextNotificationTime(
          nextNotificationTime,
          interval
        );

        console.log("Next notification scheduled for:", nextNotificationTime);

        // Continue scheduling
        scheduleNextNotification();
      }, timeUntilNext);

      // Store the timeout ID for cancellation
      activeNotifications.set(reminder.id, {
        reminderId: reminder.id,
        timeoutId,
        nextNotificationTime,
        interval,
      });

      console.log(
        "Notification scheduled successfully for reminder:",
        reminder.id
      );
    } else {
      console.log("Notification time has passed, not scheduling");
    }
  };

  // Start the notification cycle
  scheduleNextNotification();
};

export const cancelReminderNotification = (reminderId: string): void => {
  const notification = activeNotifications.get(reminderId);
  if (notification) {
    clearTimeout(notification.timeoutId);
    activeNotifications.delete(reminderId);
    console.log(`Reminder notification cancelled for: ${reminderId}`);
  }
};

export const getActiveNotificationCount = (): number => {
  return activeNotifications.size;
};

export const getNextNotificationTime = (reminderId: string): Date | null => {
  const notification = activeNotifications.get(reminderId);
  return notification ? notification.nextNotificationTime : null;
};

// Test function to check if notifications work
export const testNotification = async (): Promise<boolean> => {
  try {
    const permission = await requestNotificationPermission();
    if (permission) {
      showNotification({
        title: "Test Notification",
        body: "This is a test notification to verify everything works!",
        tag: "test",
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Test notification failed:", error);
    return false;
  }
};
