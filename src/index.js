// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";
import { msalConfig } from "./authConfig";
import "./App.css";

// 1. Create the MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// 2. Await redirect handling before rendering app
msalInstance.handleRedirectPromise()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MsalProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("MSAL redirect error:", error);
  });
