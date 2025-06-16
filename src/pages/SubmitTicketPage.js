import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [component, setComponent] = useState("");
  const [priority, setPriority] = useState("normal");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Redirect if not authenticated
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          description,
          component,
          priority,
        }),
      });

      if (response.ok) {
        setMessage("✅ Ticket submitted successfully.");
        // Clear form fields after successful submit
        setName("");
        setEmail("");
        setDescription("");
        setComponent("");
        setPriority("normal");
      } else {
        const errorData = await response.json();
        setMessage(`❌ Failed to submit ticket. ${errorData?.error || ""}`);
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
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Describe your issue..."
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Component (optional)"
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <label htmlFor="priority" style={{ display: "block", marginBottom: "0.5rem" }}>
          Priority:
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        >
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: "#3a86ff",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}
