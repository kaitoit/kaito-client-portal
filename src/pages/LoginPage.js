// src/pages/LoginPage.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import PageWrapper from "../components/PageWrapper";

export default function LoginPage() {
  const { instance } = useMsal();

  return (
    <PageWrapper>
      <h1>Login to Continue</h1>
      <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>
      <button onClick={() => instance.loginRedirect()}>Sign in with Microsoft</button>
      <footer>© 2025 Kaito IT</footer>
    </PageWrapper>
  );
}
