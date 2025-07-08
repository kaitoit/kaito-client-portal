import React, { useEffect, useState, useRef } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [component, setComponent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Ref for chat box container to enable auto scroll
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Auto-scroll chat box to bottom when chatHistory or loading changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory, chatLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("https://polite-island-07ad02510.6.azurestaticapps.net/api/submit-ticket", {
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
        <textarea
          placeholder="Describe your issue..."
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Component (optional)"
          value={component}
          onChange={(e) => setComponent(e.target.value)}
        />
        <label htmlFor="priority">Priority:</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", whiteSpace: "pre-wrap" }}>{message}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Describe your issue here to get suggestions</h2>
      <p>Kaito IT Chat Assistant</p>

      <div className="chat-box" ref={chatBoxRef}>
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
          </div>
        ))}
        {chatLoading && (
          <div>
            <em>Assistant is typing...</em>
          </div>
        )}
      </div>

      <form onSubmit={handleChatSubmit} className="chat-form">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="What can we help you with?"
        />
        <button type="submit" disabled={chatLoading}>
          {chatLoading ? "..." : "Ask"}
        </button>
      </form>

      <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
    </div>
  );
}

