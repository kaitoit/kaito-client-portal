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
    const fetchData = async () => {
      try {
        const ticketRes = await fetch(`/api/get-ticket?id=${id}`);
        if (!ticketRes.ok) throw new Error("Ticket not found");
        const ticketData = await ticketRes.json();

        const repliesRes = await fetch(`/api/get-replies?ticketId=${id}`);
        const repliesData = repliesRes.ok ? await repliesRes.json() : [];

        setTicket(ticketData);
        setReplies(repliesData);
      } catch (err) {
        console.error(err);
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="page-container">Loading ticket...</div>;
  if (error) return <div className="page-container">{error}</div>;
  if (!ticket) return <div className="page-container">Ticket not found.</div>;

  return <TicketDetailsPage ticket={ticket} initialReplies={replies} />;
}
