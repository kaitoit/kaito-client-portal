// src/pages/DashboardPage.jsx
import React, { useEffect } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // for .page-container

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // If somehow we got to this page without being signed in, bounce back to /login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  console.log("🔔 DashboardPage rendered, isAuthenticated:", isAuthenticated);

  return (
    <div className="page-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>Your login was successful, and you’re seeing the dashboard.</p>
      <button
        onClick={() => {
          navigate("/submit");
        }}
        style={{ marginTop: "1rem" }}
      >
        Submit New Ticket
      </button>
      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
