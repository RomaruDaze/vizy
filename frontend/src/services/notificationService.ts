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

// Mobile-optimized notification with multiple fallbacks
export const showMobileNotification = (data: NotificationData): void => {
  console.log("Showing mobile notification:", data);

  // Try native notification first
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      showNotification(data);
      return;
    } catch (error) {
      console.log("Native notification failed, trying fallbacks");
    }
  }

  // Fallback 1: In-app notification banner
  showInAppNotification(data);

  // Fallback 2: Audio alert (if supported)
  playNotificationSound();

  // Fallback 3: Page title flash
  flashPageTitle(data.title);

  // Fallback 4: Console log for debugging
  console.log("🔔 MOBILE NOTIFICATION:", data.title, "-", data.body);
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
    console.log("Audio notification not supported");
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
      if (isMobile()) {
        showMobileNotification({
          title: "Test Notification",
          body: "This is a test notification to verify everything works!",
          tag: "test",
        });
      } else {
        showNotification({
          title: "Test Notification",
          body: "This is a test notification to verify everything works!",
          tag: "test",
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Test notification failed:", error);
    return false;
  }
};
