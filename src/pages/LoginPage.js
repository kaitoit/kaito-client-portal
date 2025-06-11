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
    <div className="page-container">
      <h1>Login to Continue</h1>
      <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>
      <button onClick={handleLogin}>Sign in with Microsoft</button>
      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
