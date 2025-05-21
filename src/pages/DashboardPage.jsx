import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate(); // 🔑 Hook to navigate programmatically

  const clientName = "ACME Corp";
  const openTickets = 3;
  const devicesCount = 12;

  return (
    <div
      style={{
        padding: "2rem",
        color: "#eee",
        backgroundColor: "#121212",
        minHeight: "100vh",
      }}
    >
      <h1>Welcome back, {clientName}!</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Service Status</h2>
        <p>All systems operational ✅</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Support Tickets</h2>
        <p>You have {openTickets} open tickets.</p>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0078d4",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate("/submit")} // 🧭 Navigate on click
        >
          Submit New Ticket
        </button>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Devices</h2>
        <p>Currently monitoring {devicesCount} devices.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Announcements</h2>
        <p>No new announcements.</p>
      </section>
    </div>
  );
}

export default DashboardPage;

