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
    return;
  }

  const notification = new Notification(data.title, {
    body: data.body,
    icon: data.icon || "/vizy.svg",
    tag: data.tag,
    requireInteraction: true,
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto-close after 10 seconds
  setTimeout(() => {
    notification.close();
  }, 10000);
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
  const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
  const now = new Date();

  // If reminder is in the past, start from now
  const startTime = reminderDate <= now ? now : reminderDate;

  // Initial interval: 30 minutes
  let interval = 30;
  let nextNotificationTime = calculateNextNotificationTime(startTime, interval);

  const scheduleNextNotification = () => {
    const timeUntilNext = nextNotificationTime.getTime() - Date.now();

    if (timeUntilNext > 0) {
      const timeoutId = setTimeout(() => {
        // Show notification
        showNotification({
          title: "Reminder: " + reminder.title,
          body: `Your reminder is due! (${reminder.date} at ${reminder.time})`,
          tag: `reminder-${reminder.id}`,
        });

        // Schedule next notification with increased interval
        interval = Math.min(interval * 1.5, 120); // Max 2 hours
        nextNotificationTime = calculateNextNotificationTime(
          nextNotificationTime,
          interval
        );

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
