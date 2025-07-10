import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import bgVideo from "./assets/trees.mp4"; // Adjust path if needed
import logo from "./assets/kaito-logo.png"; // Adjust if different
import slogan from "./assets/slogan.png";   // Optional

export default function Layout({ children }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const handleDashboard = () => {
    navigate("/");
  };

  return (
    <>
      {/* Background video */}
      <video autoPlay muted loop className="background-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Fixed header */}
      <header className="header">
        <div className="header-content">
          <img src={logo} alt="Kaito IT" onClick={handleDashboard} style={{ cursor: "pointer" }} />
          <h1>Kaito IT Portal</h1>
          {slogan && <img src={slogan} alt="Slogan" className="slogan-image" />}
        </div>
      </header>

      {/* Main content area */}
      <div className="app-wrapper">
        <div className="main-container">{children}</div>
      </div>
    </>
  );
}
