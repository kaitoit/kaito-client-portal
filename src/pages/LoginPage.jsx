import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import "./LoginPage.css";

function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(console.error);
  };

  return (
    <div className="login-container">
      <h1>Kaito IT - Support Page</h1>
      <p>Log in with your Microsoft 365 account</p>
      <button className="login-btn" onClick={handleLogin}>
        Login with Microsoft
      </button>
      <footer>© 2025 Kaito IT</footer>
    </div>
  );
}

export default LoginPage;
