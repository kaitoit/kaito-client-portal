import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [healthData, setHealthData] = useState([
    {
      name: "Azure Active Directory",
      status: "Available",
      lastChecked: "Just now"
    },
    {
      name: "Microsoft Intune",
      status: "Available",
      lastChecked: "Just now"
    },
    {
      name: "Azure Storage",
      status: "Available",
      lastChecked: "Just now"
    },
    {
      name: "Azure Virtual Machines",
      status: "Available",
      lastChecked: "Just now"
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }

    // Simulate fetching real Azure status (replace with actual API later)
    const fetchHealthData = async () => {
      // Placeholder - simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // You would call Azure Service Health or Resource Health here
      // For now, we're just using static mock data
    };

    fetchHealthData();
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-container">
      <h1>Kaito IT Dashboard</h1>
      <p>Welcome! Here's a quick look at your current service health.</p>

      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.2rem", color: "#66aaff", marginBottom: "1rem" }}>Current Service Health Overview</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {healthData.map((service, index) => (
            <li
              key={index}
              style={{
                backgroundColor: "#1c1c1c",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: service.status === "Available" ? "1px solid #3a86ff" : "1px solid red"
              }}
            >
              <span>{service.name}</span>
              <span style={{ color: service.status === "Available" ? "limegreen" : "red" }}>
                {service.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

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
