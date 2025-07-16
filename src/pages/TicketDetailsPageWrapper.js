import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketDetailsPage from "./TicketDetailsPage";

export default function TicketDetailsPageWrapper() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicketAndReplies = async () => {
      try {
        const [ticketRes, repliesRes] = await Promise.all([
          fetch(`/api/get-ticket?id=${id}`),
          fetch(`/api/get-replies?ticketId=${id}`)
        ]);

        if (!ticketRes.ok || !repliesRes.ok) {
          throw new Error("Failed to fetch ticket or replies");
        }

        const ticketData = await ticketRes.json();
        const repliesData = await repliesRes.json();

        setTicket(ticketData);
        setReplies(repliesData);
      } catch (err) {
        console.error("Error fetching ticket or replies:", err);
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndReplies();
  }, [id]);

  if (loading) return <div className="page-container">Loading ticket...</div>;
  if (error) return <div className="page-container">{error}</div>;
  if (!ticket) return <div className="page-container">Ticket not found.</div>;

  return <TicketDetailsPage ticket={ticket} initialReplies={replies} />;
}
