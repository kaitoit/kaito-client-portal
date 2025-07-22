import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

export default function TicketDetailsPage() {
  const { id: ticketId } = useParams();
  const { accounts } = useMsal();
  const userEmail = accounts?.[0]?.username;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId || !userEmail) return;

      try {
        const response = await fetch(
          `/api/get-ticket?id=${ticketId}&email=${encodeURIComponent(userEmail)}`
        );

        if (response.ok) {
const text = await response.text();
const data = text ? JSON.parse(text) : null;
setTicket(data);
        } else {
          const errorText = await response.text();
          console.error(`Error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error.message);
      } finally {
        setLoading(false); // ✅ Important: Stop loading regardless of outcome
      }
    };

    fetchTicket();
  }, [ticketId, userEmail]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Ticket not found or you do not have access.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.07)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        p: 3,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#fff",
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Ticket: {ticket.subject}
      </Typography>
      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Description:</strong> {ticket.description}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Status:</strong> {ticket.status}
      </Typography>
      <Typography variant="body1">
        <strong>Created At:</strong>{" "}
        {new Date(ticket.createdAt).toLocaleString()}
      </Typography>
    </Paper>
  );
}

