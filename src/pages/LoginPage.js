import React from "react";
import { useMsal } from "@azure/msal-react";

export default function LoginPage() {
  const { instance } = useMsal();

  return (
    <div className="page-container">
      <h1>Login to Continue</h1>
      <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>
      <button className="login-btn" onClick={() => instance.loginRedirect()}>
        Sign in with Microsoft
      </button>
      <footer>© 2025 Kaito IT</footer>
    </div>
  );
}
