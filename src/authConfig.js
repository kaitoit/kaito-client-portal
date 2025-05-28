// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "eb60f3fd-3491-44ec-a290-3671ef7ae2fb", // Your Azure AD app's Client ID
    authority: "https://login.microsoftonline.com/common", // Full URL to your tenant
    redirectUri: "https://polite-island-07ad02510.6.azurestaticapps.net/login", // Your deployed app's URL
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false, // true for IE11 or old Edge
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};
