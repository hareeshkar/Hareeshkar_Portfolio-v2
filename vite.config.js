// File: vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    }),
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
    viteCompression({ algorithm: "gzip", ext: ".gz" }),
  ],
  base: process.env.VERCEL ? "/" : "/Hareeshkar_Portfolio/",
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
