// src/pages/TicketDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

export default function TicketDetailsPage() {
  const { id: ticketId } = useParams();
  const navigate = useNavigate();

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

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" mt={2} color="text.secondary">
          Loading ticket...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ticket Details
      </Typography>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Ticket ID:</strong> {ticket.id}
          </Typography>

          {ticket.subject && (
            <Typography variant="subtitle1" gutterBottom>
              <strong>Subject:</strong> {ticket.subject}
            </Typography>
          )}

          <Box
            sx={{
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 1,
              mb: 2,
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              Description:
            </Typography>
            <Typography variant="body2">{ticket.description}</Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            <strong>Status:</strong>{" "}
            <Chip
              label={ticket.status}
              color={ticket.status === "Open" ? "warning" : "success"}
              sx={{ ml: 1 }}
            />
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            <strong>Created At:</strong>{" "}
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : "N/A"}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            <strong>Email:</strong> {ticket.email || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      <Button variant="contained" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </Button>
    </Box>
  );
}

