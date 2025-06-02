// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "eb60f3fd-3491-44ec-a290-3671ef7ae2fb",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://polite-island-07ad02510.6.azurestaticapps.net/login",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};



