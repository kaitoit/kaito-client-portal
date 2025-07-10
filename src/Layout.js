import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import bgVideo from "./assets/trees.mp4"; // Adjust path if needed
import logo from "./assets/logo512.png"; // Adjust if different
import slogan from "./assets/cleverit.png";   // Optional

export default function Layout({ children }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const username = accounts[0]?.username || "User";

  return (
    <>
      <video autoPlay muted loop className="background-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      <header className="header">
        <div className="header-content">
          <img
            src={logo}
            alt="Kaito IT"
            onClick={handleDashboard}
            style={{ cursor: "pointer" }}
          />
          <h1>Kaito IT Portal</h1>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#ccc", fontSize: "0.9rem" }}>{username}</span>
            <button onClick={handleLogout} className="sspr-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="app-wrapper">
        <div className="main-container">{children}</div>
      </div>
    </>
  );
}
