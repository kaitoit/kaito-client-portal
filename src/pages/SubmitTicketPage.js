// src/pages/SubmitTicketPage.jsx
import React, { useEffect } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // If not signed in, bounce back to /login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  console.log("🔔 SubmitTicketPage rendered, isAuthenticated:", isAuthenticated);

  return (
    <div className="page-container">
      <h1>Submit a Support Ticket</h1>
      <p>Fill in your details below.</p>
      {/* Insert your form fields here */}
      <button
        onClick={() => {
          alert("Pretending we submitted a ticket!");
          navigate("/");
        }}
        style={{ marginTop: "1rem" }}
      >
        Submit Ticket
      </button>
      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
