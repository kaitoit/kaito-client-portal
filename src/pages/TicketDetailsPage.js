// src/pages/TicketDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TicketDetailsPage() {
  const { id: ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/get-ticket?id=${ticketId}`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const text = await response.text();

        if (!text) {
          throw new Error("Empty response body");
        }

        const data = JSON.parse(text);
        setTicket(data);
      } catch (err) {
        console.error("Error fetching ticket:", err.message);
        setError("Ticket not found or error loading ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="text-white p-4">Loading ticket...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>

      <Card className="bg-white/10 border-white/20 text-white mb-6">
        <CardContent className="p-6">
          <div className="mb-4">
            <strong>Ticket ID:</strong> {ticket.id}
          </div>
          <div className="mb-4">
            <strong>Subject:</strong> {ticket.subject}
          </div>
          <div className="mb-4">
            <strong>Description:</strong>
            <div className="bg-white/10 rounded p-3 mt-1">
              {ticket.description}
            </div>
          </div>
          <div className="mb-4">
            <strong>Status:</strong>{" "}
            <Badge className={`ml-2 ${ticket.status === "Open" ? "bg-yellow-500" : "bg-green-500"}`}>
              {ticket.status}
            </Badge>
          </div>
          <div className="mb-4">
            <strong>Created At:</strong>{" "}
            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
          </div>
          <div className="mb-4">
            <strong>Email:</strong> {ticket.email || "N/A"}
          </div>
        </CardContent>
      </Card>

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}

