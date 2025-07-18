import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TicketDetailsPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/get-ticket?id=${ticketId}`);
        if (!res.ok) throw new Error("Ticket not found");
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error(err);
        setError("Could not fetch ticket details.");
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [ticketId]);

  async function handleReplySubmit(e) {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await fetch("/api/reply-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          email: ticket.email,
          message: replyText,
        }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      const newReply = await res.json();

      setTicket((prev) => ({
        ...prev,
        replies: [...(prev.replies || []), newReply],
      }));

      setReplyText("");
    } catch (err) {
      console.error(err);
      alert("Error sending reply");
    } finally {
      setSubmittingReply(false);
    }
  }

  if (loading) return <div className="p-4">Loading ticket...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ticket Details</h2>

      <div>
        <p><strong>ID:</strong> {ticket.id}</p>
        <p><strong>Email:</strong> {ticket.email}</p>
        <p><strong>Subject:</strong> {ticket.subject}</p>
        <p><strong>Message:</strong> {ticket.message}</p>
        <p><strong>Status:</strong> {ticket.status || "Open"}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Replies</h3>
        <div className="space-y-2">
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">
                  <strong>{reply.email}</strong> - {new Date(reply.timestamp).toLocaleString()}
                </p>
                <p className="mt-1">{reply.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No replies yet.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleReplySubmit} className="space-y-4">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          rows="4"
          className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={submittingReply}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {submittingReply ? "Sending..." : "Send Reply"}
        </button>
      </form>
    </div>
  );
}

export default TicketDetailsPage;

