// src/pages/LoginPage.js
import React, { useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useNavigate } from "react-router-dom";
import "../App.css"; // so .page-wrapper + .page-container are available

export default function LoginPage() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // If already signed in, send the user to "/"
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(console.error);
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h1>Kaito IT - Support Page</h1>
        <p>Log in with your Microsoft 365 account</p>
        <button onClick={handleLogin}>Login with Microsoft</button>
        <footer>© 2025 Kaito IT</footer>
      </div>
    </div>
  );
}
