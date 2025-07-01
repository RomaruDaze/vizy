class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  async requestPermission(): Promise<boolean> {
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
  }

  async registerServiceWorker(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not supported");
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("Service Worker registered successfully");
      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  async sendNotification(title: string, body: string): Promise<void> {
    if (!this.registration) {
      console.log("Service Worker not registered");
      return;
    }

    console.log("Attempting to send notification:", title, body);

    try {
      await this.registration.showNotification(title, {
        body: body,
        icon: "/vizy.svg",
        badge: "/vizy.svg",
        requireInteraction: true,
        silent: false,
        tag: "vizy-notification",
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      } as NotificationOptions);
      console.log("Notification sent successfully");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  startTestNotifications(): void {
    if (this.intervalId) {
      console.log("Test notifications already running");
      return;
    }

    console.log("Starting test notifications every 1 second...");
    console.log("Service Worker registration:", this.registration);

    this.intervalId = setInterval(async () => {
      const timestamp = new Date().toLocaleTimeString();
      console.log("Sending notification at:", timestamp);
      await this.sendNotification(
        "Vizy Test Notification",
        `This is a test notification sent at ${timestamp}`
      );
    }, 1000); // 1 second
  }

  stopTestNotifications(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Test notifications stopped");
    }
  }

  async initialize(): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      return false;
    }

    const isRegistered = await this.registerServiceWorker();
    return isRegistered;
  }

  async testBasicNotification(): Promise<void> {
    console.log("Testing basic notification...");
    console.log("Notification permission:", Notification.permission);

    if (Notification.permission === "granted") {
      try {
        const notification = new Notification("Test Notification", {
          body: "This is a basic test notification",
          tag: "test-notification",
          requireInteraction: true,
          silent: false,
        });

        console.log("Basic notification created:", notification);

        notification.onshow = () => {
          console.log("Notification shown!");
        };

        notification.onclick = () => {
          console.log("Notification clicked!");
          notification.close();
        };

        notification.onclose = () => {
          console.log("Notification closed!");
        };

        notification.onerror = (error) => {
          console.error("Notification error:", error);
        };

        setTimeout(() => {
          if (notification) {
            console.log("Auto-closing notification");
            notification.close();
          }
        }, 5000);
      } catch (error) {
        console.error("Basic notification failed:", error);
      }
    } else {
      console.log("Notification permission not granted");
    }
  }
}

export const notificationService = new NotificationService();
