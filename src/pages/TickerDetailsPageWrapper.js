// src/pages/TicketDetailsPageWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketDetailsPage from "./TicketDetailsPage";

export default function TicketDetailsPageWrapper() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await fetch(`/api/get-ticket?id=${id}`);
      const data = await res.json();
      setTicket(data);
    };
    fetchTicket();
  }, [id]);

  if (!ticket) return <p style={{ color: "white" }}>Loading ticket details...</p>;

  return <TicketDetailsPage ticket={ticket} />;
}
