// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import StatusBadge from "../components/StatusBadge";
import "../App.css";

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [services] = useState([
    { name: "Email", description: "Sending and receiving emails", status: "OK" },
    { name: "File Access", description: "Accessing shared files and cloud storage", status: "OK" },
    { name: "Device Security", description: "Antivirus, updates, and compliance", status: "OK" },
    { name: "Remote Access", description: "Connecting from home or offsite", status: "Issue" },
  ]);

  const [tickets, setTickets] = useState([]);

  const hasIssue = services.some(service => service.status !== "OK");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Load support tickets from API
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/get-tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      }
    };

    fetchTickets();
  }, [isAuthenticated, navigate]);

  return (
    <PageWrapper>
      <h1>Kaito IT System Dashboard</h1>
      <p>
        {hasIssue ? (
          <span style={{ color: "orange", fontWeight: "bold" }}>
           ⚠️ Some systems are experiencing issues.
          </span>
        ) : (
          <span style={{ color: "limegreen", fontWeight: "bold" }}>
            ✅ All systems are operational.
          </span>
        )}
      </p>

      {/* SYSTEM STATUS */}
      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h2 className="section-title">Service Status Overview</h2>
        <ul className="service-list">
          {services.map((service, index) => (
            <li key={index} className="service-item">
              <div>
                <div className="service-name">{service.name}</div>
                <div className="service-desc">{service.description}</div>
              </div>
              <StatusBadge status={service.status} />
            </li>
          ))}
        </ul>
      </div>

      {/* SUPPORT TICKETS */}
      <div style={{ marginTop: "3rem", textAlign: "left" }}>
        <h2 className="section-title">Submitted Support Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets submitted yet.</p>
        ) : (
          <div className="ticket-list">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <h3>{ticket.subject || "No subject"}</h3>
                <p>{ticket.description}</p>
                <Link to={`/ticket/${ticket.id}?email=${encodeURIComponent(ticket.email)}`}>
                  View & Reply
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => navigate("/submit")} style={{ marginTop: "2rem" }}>
        Submit Support Request
      </button>

      <footer>© 2025 Kaito IT</footer>
    </PageWrapper>
  );
}

