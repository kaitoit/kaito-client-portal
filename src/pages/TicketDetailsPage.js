// src/pages/TicketDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";

export default function TicketDetailsPage() {
  const { id: ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/get-ticket?id=${ticketId}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const text = await response.text();
        if (!text) throw new Error("Empty response body");
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

  if (loading) return <Typography sx={{ color: "#fff", p: 2 }}>Loading ticket...</Typography>;
  if (error) return <Typography sx={{ color: "#f87171", p: 2 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 2, color: "#fff" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
        Ticket Details
      </Typography>

      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent>
          <Typography sx={{ mb: 2 }}>
            <strong>Ticket ID:</strong> {ticket.id}
          </Typography>

          <Typography sx={{ mb: 2 }}>
            <strong>Subject:</strong> {ticket.subject}
          </Typography>

          <Typography sx={{ mb: 2 }}>
            <strong>Description:</strong>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                p: 2,
                mt: 1,
                backdropFilter: "blur(6px)",
              }}
            >
              {ticket.description}
            </Box>
          </Typography>

          <Typography sx={{ mb: 2 }}>
            <strong>Status:</strong>{" "}
            <Chip
              label={ticket.status}
              sx={{
                ml: 1,
                color: "#fff",
                backgroundColor:
                  ticket.status === "Open" ? "#facc15" : "#22c55e",
              }}
            />
          </Typography>

          <Typography sx={{ mb: 2 }}>
            <strong>Created At:</strong>{" "}
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : "N/A"}
          </Typography>

          <Typography sx={{ mb: 2 }}>
            <strong>Email:</strong> {ticket.email || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{
          backgroundColor: "#2563eb",
          "&:hover": {
            backgroundColor: "#1d4ed8",
          },
          color: "#fff",
          borderRadius: 2,
          px: 3,
          py: 1,
          textTransform: "none",
          boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
        }}
      >
        ← Back to Dashboard
      </Button>
    </Box>
  );
}



