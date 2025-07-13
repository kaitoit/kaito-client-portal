// src/pages/TicketDetailsPageWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketDetailsPage from "./TicketDetailsPage";

export default function TicketDetailsPageWrapper() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/get-ticket?id=${id}`);
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <div className="loading-indicator">Loading ticket...</div>;
  if (!ticket) return <div className="error">Ticket not found</div>;

  return <TicketDetailsPage ticket={ticket} />;
}
