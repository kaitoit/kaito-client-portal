// src/pages/DashboardPage.jsx
import React from "react";
import "../App.css"; // ensure .page-container is available

export default function DashboardPage() {
  console.log("🔔 DashboardPage is rendering");
  return (
    <div className="page-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>Your login was successful, and you’re seeing the dashboard.</p>
      {/* Example buttons or links */}
      <button onClick={() => window.location.href = "/submit"}>
        Submit a Ticket
      </button>
    </div>
  );
}
