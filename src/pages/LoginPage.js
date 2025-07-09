// src/pages/LoginPage.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import "../App.css"; // Ensure styles are applied

export default function LoginPage() {
  const { instance } = useMsal();

  return (
    <>
      {/* Optional: video background */}
      <video className="background-video" autoPlay muted loop playsInline>
        <source src={process.env.PUBLIC_URL + "/trees.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="app-wrapper">
        <div className="main-container">
          <div className="page-container">
            <h1>Login to Continue</h1>
            <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>

            <button className="login-btn" onClick={() => instance.loginRedirect()}>
              Sign in with Microsoft
            </button>

            {/* Optional self-service password reset */}
            <button
              className="sspr-btn"
              onClick={() =>
                window.open("https://passwordreset.microsoftonline.com/", "_blank")
              }
            >
              Forgot your password?
            </button>

            <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
          </div>
        </div>
      </div>
    </>
  );
}
