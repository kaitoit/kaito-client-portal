import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Reset auth state
    navigate("/login");
    window.location.reload(); // quick workaround for resetting state
  };

  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/submit">Submit Ticket</Link>
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
