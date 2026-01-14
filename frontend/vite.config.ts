import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", 
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    // minify defaults to "oxc" in Vite 6 (faster than Terser)
    target: "esnext", // Target modern browsers
    cssCodeSplit: true, // Split CSS per async chunk
    chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1MB
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            // React and React DOM
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            // Firebase
            if (id.includes("firebase")) {
              return "firebase-vendor";
            }
            // React Router
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            // Leaflet (maps)
            if (id.includes("leaflet")) {
              return "leaflet-vendor";
            }
            // Other vendor libraries
            return "vendor";
          }
          // Document components (large, rarely accessed)
          if (id.includes("/documents/")) {
            return "documents";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true, // Allow external connections
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});
