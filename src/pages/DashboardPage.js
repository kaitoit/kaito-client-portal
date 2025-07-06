// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
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

  const hasIssue = services.some(service => service.status !== "OK");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <PageWrapper>
      <h1>Kaito IT System Dashboard</h1>
      <p>
        {hasIssue
          ? <span style={{ color: "orange", fontWeight: "bold" }}>⚠️ Some systems are experiencing issues.</span>
          : <span style={{ color: "limegreen", fontWeight: "bold" }}>✅ All systems are operational.</span>}
      </p>

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.2rem", color: "#66aaff", marginBottom: "1rem" }}>Service Status Overview</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {services.map((service, index) => (
            <li key={index} style={{
              backgroundColor: "#1c1c1c",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontWeight: "bold" }}>{service.name}</div>
                <div style={{ color: "#aaa", fontSize: "0.85rem" }}>{service.description}</div>
              </div>
              <StatusBadge status={service.status} />
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate("/submit")}>Submit Support Request</button>
      <footer>© 2025 Kaito IT</footer>
    </PageWrapper>
  );
}

