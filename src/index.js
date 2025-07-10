// src/index.js
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';

import App from './App';

const msalInstance = new PublicClientApplication(msalConfig);

// ✅ Ensure MSAL is initialized before rendering the app
msalInstance.initialize().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </React.StrictMode>
  );
}).catch((error) => {
  console.error("❌ MSAL initialization failed:", error);
});
