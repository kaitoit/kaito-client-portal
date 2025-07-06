// src/pages/LoginPage.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import "../App.css";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect();
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">
        <div className="page-container">
          <h1>Login to Continue</h1>
          <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>
          <button onClick={handleLogin}>Sign in with Microsoft</button>
          <footer>© 2025 Kaito IT</footer>
        </div>
      </div>
    </div>
  );
}
