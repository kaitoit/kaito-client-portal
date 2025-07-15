// src/pages/TicketDetailsPageWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketDetailsPage from "./TicketDetailsPage";

export default function TicketDetailsPageWrapper() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/get-ticket?id=${id}`);
        if (!res.ok) {
          throw new Error("Failed to load ticket");
        }
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <div className="page-container">Loading ticket...</div>;
  if (error) return <div className="page-container">{error}</div>;
  if (!ticket) return <div className="page-container">Ticket not found.</div>;

  return <TicketDetailsPage ticket={ticket} />;
}
