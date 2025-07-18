// src/pages/TicketDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../App.css";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/get-ticket?id=${id}&email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Ticket not found");
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        setError("Ticket not found or failed to load.");
        console.error(err);
      }
    };

    const fetchReplies = async () => {
      try {
        const res = await fetch(`/api/get-replies?ticketId=${id}`);
        const data = await res.json();
        setReplies(data);
      } catch (err) {
        console.error("Failed to load replies:", err);
      }
    };

    if (id && email) {
      fetchTicket();
      fetchReplies();
    }
  }, [id, email]);

  const handleSubmitReply = async () => {
    if (!newReply.trim()) return;

    try {
      const res = await fetch("/api/reply-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id, reply: newReply, email }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      const replyData = await res.json();
      setReplies([...replies, replyData]);
      setNewReply("");
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!ticket) {
    return <div className="loading-indicator">Loading ticket details...</div>;
  }

  return (
    <div className="ticket-details">
      <h2>Ticket Details</h2>
      <p><strong>Subject:</strong> {ticket.subject}</p>
      <p><strong>Description:</strong> {ticket.description}</p>
      <p><strong>Status:</strong> {ticket.status || "Open"}</p>

      <hr />

      <h3>Replies</h3>
      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul>
          {replies.map((reply, index) => (
            <li key={index}>
              <div><strong>{reply.sender || "Support"}:</strong></div>
              <div>{reply.message}</div>
              <div className="reply-timestamp">{reply.timestamp}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="reply-form">
        <textarea
          rows="4"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Type your reply here..."
        />
        <button onClick={handleSubmitReply}>Send Reply</button>
      </div>
    </div>
  );
}


