// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Simulate fetching Azure region health (Option 2: Mock Version)
  useEffect(() => {
    const fetchMockRegionStatus = () => {
      setTimeout(() => {
        setRegions([
          { name: "Australia East", status: "OK" },
          { name: "Central US", status: "OK" },
          { name: "Japan East", status: "Service Issue" },
        ]);
      }, 1000);
    };

    fetchMockRegionStatus();
  }, []);

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

      {/* Azure Region Status Section */}
      <div className="health-card" style={{ marginTop: "2rem", textAlign: "left" }}>
        <h2 style={{ color: "#66aaff", marginBottom: "1rem" }}>Azure Datacenter Status</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {regions.length === 0 ? (
            <li>Loading region status...</li>
          ) : (
            regions.map((region) => (
              <li key={region.name} style={{ marginBottom: "0.5rem" }}>
                {region.status === "OK" ? "🟢" : "🔴"} <strong>{region.name}</strong> – {region.status}
              </li>
            ))
          )}
        </ul>
      </div>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
