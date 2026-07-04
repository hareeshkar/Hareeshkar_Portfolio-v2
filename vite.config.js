// File: vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/Hareeshkar_Portfolio/", // Required for GitHub Pages to serve assets correctly
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Prevent Contact from being in a separate chunk initially
          "react-vendor": ["react", "react-dom"],
          animation: ["framer-motion", "gsap"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
