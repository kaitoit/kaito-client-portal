import React, { useState } from "react";

export default function TicketDetailsPage({ ticket }) {
  const [replies, setReplies] = useState(ticket.replies || []);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const sendReply = async (e) => {
    e.preventDefault();
    setSending(true);

    const res = await fetch("/api/reply-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: ticket.id,
        email: ticket.email,
        author: "IT Staff",
        message: replyText
      })
    });

    if (res.ok) {
      const newReply = { author: "IT Staff", message: replyText, timestamp: new Date().toISOString() };
      setReplies([...replies, newReply]);
      setReplyText("");
    } else {
      alert("Failed to send reply.");
    }

    setSending(false);
  };

  return (
    <div className="page-container">
      <h1>Ticket Details</h1>
      <p><strong>{ticket.name}</strong> ({ticket.email})</p>
      <p><strong>Issue:</strong> {ticket.description}</p>
      <hr />
      <h2>Conversation</h2>
      <div className="chat-box" style={{ maxHeight: 300, overflowY: "auto" }}>
        {replies.map((r, i) => (
          <div key={i}>
            <strong>{r.author}</strong>: {r.message}
            <div style={{ fontSize: "0.8rem", color: "#888" }}>{new Date(r.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendReply} className="chat-form" style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Write a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          required
        />
        <button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
