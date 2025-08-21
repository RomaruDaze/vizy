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

// Check if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showNotification = (data: NotificationData): void => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
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
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

// Mobile-optimized notification with multiple fallbacks
export const showMobileNotification = (data: NotificationData): void => {
  // Try native notification first
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      showNotification(data);
      return;
    } catch (error) {
      // Native notification failed, continue to fallbacks
    }
  }

  // Fallback 1: In-app notification banner
  showInAppNotification(data);

  // Fallback 2: Audio alert (if supported)
  playNotificationSound();

  // Fallback 3: Page title flash
  flashPageTitle(data.title);
};

const showInAppNotification = (data: NotificationData): void => {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll(
    ".mobile-notification"
  );
  existingNotifications.forEach((n) => n.remove());

  const notificationElement = document.createElement("div");
  notificationElement.className = "mobile-notification";
  notificationElement.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: slideDown 0.3s ease;
    border: 2px solid rgba(255,255,255,0.2);
  `;

  notificationElement.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <div style="font-size: 24px;">🔔</div>
      <div style="flex: 1;">
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${data.title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${data.body}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 5px;">×</button>
    </div>
  `;

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notificationElement);

  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (notificationElement.parentNode) {
      notificationElement.parentNode.removeChild(notificationElement);
    }
  }, 8000);
};

const playNotificationSound = (): void => {
  try {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    // Audio notification not supported
  }
};

const flashPageTitle = (title: string): void => {
  const originalTitle = document.title;
  let flashCount = 0;
  const maxFlashes = 5;

  const flash = () => {
    if (flashCount >= maxFlashes) {
      document.title = originalTitle;
      return;
    }

    document.title = flashCount % 2 === 0 ? `🔔 ${title}` : originalTitle;
    flashCount++;

    setTimeout(flash, 500);
  };

  flash();
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

// Store reminders in localStorage for mobile persistence
const storeReminderInStorage = (reminder: any) => {
  try {
    const storedReminders = JSON.parse(
      localStorage.getItem("vizy-reminders") || "[]"
    );
    storedReminders.push({
      ...reminder,
      scheduledTime: new Date(`${reminder.date}T${reminder.time}`).getTime(),
    });
    localStorage.setItem("vizy-reminders", JSON.stringify(storedReminders));
  } catch (error) {
    // Error storing reminder
  }
};

// Check for due reminders when app becomes visible
const checkStoredReminders = () => {
  try {
    const storedReminders = JSON.parse(
      localStorage.getItem("vizy-reminders") || "[]"
    );
    const now = Date.now();
    const dueReminders = storedReminders.filter(
      (r: any) => r.scheduledTime <= now
    );

    dueReminders.forEach((reminder: any) => {
      showMobileNotification({
        title: "Reminder: " + reminder.title,
        body: `Your reminder is due! (${reminder.date} at ${reminder.time})`,
        tag: `reminder-${reminder.id}`,
      });
    });

    // Remove due reminders
    const remainingReminders = storedReminders.filter(
      (r: any) => r.scheduledTime > now
    );
    localStorage.setItem("vizy-reminders", JSON.stringify(remainingReminders));
  } catch (error) {
    // Error checking stored reminders
  }
};

// Listen for app visibility changes
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      checkStoredReminders();
    }
  });
}

export const scheduleReminderNotification = (reminder: {
  id: string;
  title: string;
  date: string;
  time: string;
}): void => {
  const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
  const now = new Date();

  // For mobile, store in localStorage as backup
  if (isMobile()) {
    storeReminderInStorage(reminder);
  }

  // If reminder is in the past, start from now
  const startTime = reminderDate <= now ? now : reminderDate;

  // Initial interval: 30 minutes
  let interval = 30;

  // First notification should be at the exact reminder time (or now if past)
  let nextNotificationTime = startTime;

  const scheduleNextNotification = () => {
    const timeUntilNext = nextNotificationTime.getTime() - Date.now();

    if (timeUntilNext > 0) {
      const timeoutId = setTimeout(() => {
        // Use mobile-optimized notification for mobile devices
        if (isMobile()) {
          showMobileNotification({
            title: "Reminder: " + reminder.title,
            body: `Your reminder is due! (${reminder.date} at ${reminder.time})`,
            tag: `reminder-${reminder.id}`,
          });
        } else {
          // Use native notification for desktop
          showNotification({
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
  }

  // Also remove from localStorage
  try {
    const storedReminders = JSON.parse(
      localStorage.getItem("vizy-reminders") || "[]"
    );
    const remainingReminders = storedReminders.filter(
      (r: any) => r.id !== reminderId
    );
    localStorage.setItem("vizy-reminders", JSON.stringify(remainingReminders));
  } catch (error) {
    // Error removing reminder from storage
  }
};

export const getActiveNotificationCount = (): number => {
  return activeNotifications.size;
};

export const getNextNotificationTime = (reminderId: string): Date | null => {
  const notification = activeNotifications.get(reminderId);
  return notification ? notification.nextNotificationTime : null;
};
