// src/pages/SubmitTicketPage.js
import React from "react";
import "../App.css";

export default function SubmitTicketPage() {
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h1>Submit a Support Ticket</h1>
        <p>Fill in your details below.</p>
        {/* Add your ticket form inputs here */}
        <button onClick={() => alert("Ticket submitted!")}>
          Submit
        </button>
        <footer>© 2025 Kaito IT</footer>
      </div>
    </div>
  );
}
