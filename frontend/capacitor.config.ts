import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vizy.app",
  appName: "Vizy",
  webDir: "dist",
  server: {
    androidScheme: "https",
    iosScheme: "http",
    cleartext: true,
  },
  ios: {
    scheme: "App",
    webView: {
      allowsBackForwardNavigationGestures: true,
    },
  },
};

export default config;
