// File: /src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./components/ThemeContext.jsx";
import { ParticleProvider } from "./components/ParticleContext.jsx";
import { LenisProvider } from "./contexts/LenisContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LenisProvider>
        <ParticleProvider>
          <App />
        </ParticleProvider>
      </LenisProvider>
    </ThemeProvider>
  </React.StrictMode>
);
