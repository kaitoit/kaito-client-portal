// src/pages/TicketDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/get-ticket?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data.ticket);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ticket:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  if (!ticket) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 4 }}>
        Ticket not found.
      </Typography>
    );
  }

  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
        padding: 3,
        borderRadius: 3,
        boxShadow: 5,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {ticket.subject}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {ticket.description}
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Status: {ticket.status}
        </Typography>

        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/ticket/${ticket.id}/replies`}
          >
            View Replies
          </Button>
          <Button variant="outlined" component={Link} to="/">
            Back to Dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}




