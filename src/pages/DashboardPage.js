import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // Friendly user-facing service health
  const [services] = useState([
    {
      name: "Email",
      description: "Sending and receiving emails",
      status: "OK"
    },
    {
      name: "File Access",
      description: "Accessing shared files and cloud storage",
      status: "OK"
    },
    {
      name: "Device Security",
      description: "Antivirus, updates, and compliance",
      status: "OK"
    },
    {
      name: "Remote Access",
      description: "Connecting from home or offsite",
      status: "Issue"
    }
  ]);

  // Overall health summary
  const hasIssue = services.some(service => service.status !== "OK");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-container">
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

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.2rem", color: "#66aaff", marginBottom: "1rem" }}>
          Service Status Overview
        </h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {services.map((service, index) => (
            <li
              key={index}
              style={{
                backgroundColor: "#1c1c1c",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: service.status === "OK" ? "1px solid #3a86ff" : "1px solid orange",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: "1rem", fontWeight: "bold" }}>{service.name}</div>
                <div style={{ fontSize: "0.85rem", color: "#aaa" }}>{service.description}</div>
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: service.status === "OK" ? "limegreen" : "orange"
                }}
              >
                {service.status === "OK" ? "✅ Operational" : "⚠️ Issue"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/submit")}
        style={{
          marginTop: "1rem",
          backgroundColor: "#3a86ff",
          color: "white",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Submit Support Request
      </button>

      <footer style={{ marginTop: "3rem", color: "#666" }}>© 2025 Kaito IT</footer>
    </div>
  );
}

