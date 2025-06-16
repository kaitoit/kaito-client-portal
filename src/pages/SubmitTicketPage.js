import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject,
          description,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setMessage("✅ Ticket submitted successfully.");
        setSubject("");
        setDescription("");
      } else {
        setMessage("❌ Failed to submit ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setMessage("❌ Network error. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <div className="page-container">
      <h1>Submit a Support Ticket</h1>
      <p>Fill out the form below to create a new support request.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <textarea
          name="description"
          placeholder="Describe your issue..."
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: "#3a86ff",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}

