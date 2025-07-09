// src/index.js
import "./App.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

import App from "./App";

// 1. Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// 2. Wait for MSAL to finish handling login redirect
msalInstance
  .handleRedirectPromise()
  .then(() => {
    const root = ReactDOM.createRoot(document.getElementById("root"));

    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MsalProvider>
      </React.StrictMode>
    );

    console.log("✅ MSAL initialized and redirect handled.");
  })
  .catch((error) => {
    console.error("❌ MSAL redirect error:", error);
  });
