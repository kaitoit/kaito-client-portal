// src/pages/SubmitTicketPage.jsx
import React, { useEffect } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-container">
      <h1>Submit a Support Ticket</h1>
      <p>Fill out the form below to create a new support request.</p>
      
      <form onSubmit={(e) => { e.preventDefault(); alert("Ticket submitted!"); }}>
        <input
          type="text"
          placeholder="Subject"
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Describe your issue..."
          rows="5"
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button type="submit">Submit Ticket</button>
      </form>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
