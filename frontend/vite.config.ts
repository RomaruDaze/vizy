import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Use relative paths for mobile
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 5173,
    host: true, // Allow external connections
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
    // Enable WebSocket connections through proxy
    ws: true,
  },
});
