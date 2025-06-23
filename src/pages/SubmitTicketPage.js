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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Chat assistant state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Ticket submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, description, component, priority }),
      });

      if (response.ok) {
        setMessage("✅ Ticket submitted successfully.");
        setName("");
        setEmail("");
        setDescription("");
        setComponent("");
        setPriority("normal");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(`❌ Failed to submit ticket. ${errorData?.error || "Unknown error."}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ChatGPT submit handler
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.reply) {
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Assistant error." }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Network error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Submit a Support Ticket</h1>
      <p>Fill out the form below to create a new support request.</p>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <textarea placeholder="Describe your issue..." rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Component (optional)" value={component} onChange={(e) => setComponent(e.target.value)} />
        <label htmlFor="priority">Priority:</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Describe your issue here to get suggestions</h2>
      <p>Kaito IT Chat Assistant</p>

      <div style={{ background: "#f1f1f1", padding: "1rem", borderRadius: "8px" }}>
        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1rem" }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
            </div>
          ))}
          {chatLoading && <div><em>Assistant is typing...</em></div>}
        </div>

        <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="What can we help you with?"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={chatLoading} style={{ backgroundColor: "#06d6a0", color: "white" }}>
            {chatLoading ? "..." : "Ask"}
          </button>
        </form>
      </div>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}


