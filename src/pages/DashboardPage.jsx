// src/pages/DashboardPage.js
import React from "react";
import "../App.css"; // ensure .page-container is available

export default function DashboardPage() {
  return (
    <div className="page-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>You’re successfully signed in.</p>
      <button onClick={() => window.location.href = "/submit"}>
        Submit a Ticket
      </button>
      <footer>© 2025 Kaito IT</footer>
    </div>
  );
}
