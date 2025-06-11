// src/pages/DashboardPage.jsx
import React, { useEffect } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-container">
      <h1>Kaito IT Dashboard</h1>
      <p>Your login was successful. View service status and submit support tickets.</p>
      
      <button
        onClick={() => navigate("/submit")}
        style={{ marginTop: "1rem" }}
      >
        Submit New Ticket
      </button>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
