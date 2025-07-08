// src/pages/LoginPage.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect();
  };

  const handleSSPR = () => {
    window.open("https://passwordreset.microsoftonline.com", "_blank", "noopener,noreferrer");
  };

  return (
    <PageWrapper>
      <h1>Login to Continue</h1>
      <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
        <button onClick={handleLogin} className="login-btn">
          Sign in with Microsoft
        </button>

        <button onClick={handleSSPR} className="sspr-btn">
          Forgot your password? Reset here
        </button>
      </div>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </PageWrapper>
  );
}
