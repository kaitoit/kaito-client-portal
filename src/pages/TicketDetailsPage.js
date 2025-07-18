// src/pages/TicketDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/get-ticket/${id}`);
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        setTicket(data);
        setReplies(data.replies || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const res = await fetch("/api/reply-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          email: ticket.email,
          author: "IT Staff",
          message: replyText,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("❌ Failed to send reply: " + (errorData.error || "Unknown error"));
        return;
      }

      const newReply = {
        author: "IT Staff",
        message: replyText,
        timestamp: new Date().toISOString(),
      };

      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
    } catch (err) {
      console.error(err);
      alert("❌ Network error. Reply failed.");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading ticket details...</p>
      </PageWrapper>
    );
  }

  if (!ticket) {
    return (
      <PageWrapper>
        <p>❌ Ticket not found.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1>Ticket Details</h1>
      <div className="ticket-meta">
        <p><strong>Name:</strong> {ticket.name}</p>
        <p><strong>Email:</strong> {ticket.email}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Status:</strong> {ticket.status || "Open"}</p>
      </div>

      <hr />

      <h2>Conversation</h2>
      <div className="chat-box" style={{ marginBottom: "1rem" }}>
        {replies.length === 0 && <p>No replies yet.</p>}
        {replies.map((r, i) => (
          <div key={i} className="chat-message" style={{ marginBottom: "1rem" }}>
            <strong>{r.author}</strong>: {r.message}
            <div style={{ fontSize: "0.8rem", color: "#888" }}>{new Date(r.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendReply} className="chat-form">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </PageWrapper>
  );
}


