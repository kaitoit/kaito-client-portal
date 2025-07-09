import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutRedirect().catch(e => {
      console.error(e);
      // fallback logout method or notification
    });
  };

  return (
    <div className="app-wrapper">
      {/* Background video */}
      <video autoPlay muted loop className="background-video" playsInline>
        <source src="/trees.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fixed header */}
      <header className="header">
        <div className="header-content">
          <img src="/logo.png" alt="Kaito IT Logo" />
          <h1>Kaito IT Client Portal</h1>

          {/* Show user email if logged in */}
          {accounts.length > 0 && (
            <>
              <div style={{ marginLeft: "auto", color: "#ccc", fontWeight: "bold" }}>
                {accounts[0].username}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "1rem",
                  padding: "0.4rem 1rem",
                  background: "#c0392b",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="main-container">{children}</main>
    </div>
  );
}
