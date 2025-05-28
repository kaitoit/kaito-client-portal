import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.handleRedirectPromise()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App msalInstance={msalInstance} />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("MSAL redirect error:", error);
  });
