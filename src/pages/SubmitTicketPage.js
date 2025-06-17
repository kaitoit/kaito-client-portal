import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // Ticket form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [component, setComponent] = useState("");
  const [priority, setPriority] = useState("normal");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // ChatGPT assistant state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Submit ticket handler
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

  // ChatGPT assistant handler
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (res.ok) {
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Assistant error." }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Network error." }]);
    }
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
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Need help describing your issue?</h2>
      <p>Use our AI Assistant below to help you write your ticket more clearly.</p>

      <div style={{ background: "#f1f1f1", padding: "1rem", borderRadius: "8px" }}>
        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1rem" }}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask for help writing your ticket..."
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#06d6a0", color: "white", border: "none", borderRadius: "5px" }}>
            Ask
          </button>
        </form>
      </div>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}

