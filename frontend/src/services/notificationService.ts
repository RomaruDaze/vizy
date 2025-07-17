class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "denied") {
      return;
    }

    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  async sendNotification(title: string, body: string): Promise<void> {
    if (!this.registration) {
      return;
    }

    const basePath = process.env.NODE_ENV === "production" ? "/vizy" : "";

    try {
      await this.registration.showNotification(title, {
        body: body,
        icon: `${basePath}/vizy.svg`,
        badge: `${basePath}/vizy.svg`,
        requireInteraction: true,
        silent: false,
        tag: "vizy-notification",
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      } as NotificationOptions);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  private testNotificationInterval: NodeJS.Timeout | null = null;

  startTestNotifications() {
    if (this.testNotificationInterval) {
      return;
    }

    const sendTestNotification = () => {
      const timestamp = new Date().toLocaleTimeString();
      this.sendNotification("Test Notification", `Test at ${timestamp}`);
    };

    this.testNotificationInterval = setInterval(sendTestNotification, 1000);
  }

  stopTestNotifications() {
    if (this.testNotificationInterval) {
      clearInterval(this.testNotificationInterval);
      this.testNotificationInterval = null;
    }
  }

  testBasicNotification() {
    if (Notification.permission !== "granted") {
      return;
    }

    try {
      const notification = new Notification("Test Notification", {
        body: "This is a test notification",
        icon: "/vizy.svg",
        badge: "/vizy.svg",
        requireInteraction: true,
        silent: false,
        tag: "test-notification",
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      });

      notification.onclick = () => {
        notification.close();
      };

      notification.onclose = () => {
        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
      };
    } catch (error) {
      console.error("Basic notification failed:", error);
    }
  }
}

export default NotificationService;
 