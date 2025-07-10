import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import App from "./App";
import { msalConfig } from "./authConfig";
import "./App.css";

// ✅ Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// ✅ Make sure MSAL handles redirect **before** app renders
msalInstance.handleRedirectPromise().then(() => {
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
}).catch(error => {
  console.error("❌ MSAL redirect error:", error);
});
