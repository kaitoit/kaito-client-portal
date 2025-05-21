// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "abd9a866-be13-4e0f-a3f2-d4bb89f59504",
    authority: "https://login.microsoftonline.com/57f93cd5-4828-49a4-b601-0a7b89ddd41b",
    redirectUri: "http://localhost:3000",  // or your production URL
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
