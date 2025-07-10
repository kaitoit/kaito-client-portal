// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "eb60f3fd-3491-44ec-a290-3671ef7ae2fb",
    authority: "https://login.microsoftonline.com/57f93cd5-4828-49a4-b601-0a7b89ddd41b",
    redirectUri: "https://polite-island-07ad02510.6.azurestaticapps.net/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};



