// src/pages/DashboardPage.jsx
import React from "react";
import "../App.css";

export default function DashboardPage() {
  return (
    <div className="page-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>Your login was successful, and you’re seeing the dashboard.</p>
      <button onClick={() => window.location.href = "/submit"}>
        Submit a Ticket
      </button>
      <footer>© 2025 Kaito IT</footer>
    </div>
  );
}
