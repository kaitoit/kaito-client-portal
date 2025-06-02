// src/index.js
import "./App.css";                   // Global CSS (video + containers)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig"; // Make sure authority is full URL

import App from "./App";

// 1. Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// 2. Render the app immediately. MSAL React will auto-handle redirect processing.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>
);

// A simple console.log to verify index.js ran
console.log("🔔 index.js rendered, MSAL instance created");
