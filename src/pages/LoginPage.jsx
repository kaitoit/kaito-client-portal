import React from "react";
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './LoginPage.css';

export default function LoginPage() {
  const { instance } = useMsal();
  const handleLogin = () => instance.loginRedirect(loginRequest);

  return (
    <div className="login-page centered">
      <div className="login-card">
        <h1>Kaito IT Support</h1>
        <p>Please log in with your Microsoft 365 account</p>
        <button onClick={handleLogin}>Login with Microsoft</button>
        <footer>© 2025 Kaito IT</footer>
      </div>
    </div>
  );
}

