import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import App from './App';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// ✅ REQUIRED for MSAL v3+: Initialize it
msalInstance.initialize().then(() => {
  // ✅ Now safely handle the redirect result
  msalInstance.handleRedirectPromise().then(() => {
    // ✅ Now you can render the app
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MsalProvider>
      </React.StrictMode>
    );
  });
});
