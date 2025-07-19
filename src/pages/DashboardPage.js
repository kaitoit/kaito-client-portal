// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/get-all-tickets");
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Error loading tickets:", err.message);
      }
    };
    fetchTickets();
  }, []);

  return (
    <Box sx={{ p: 4, color: "#fff" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Dashboard
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/submit"
        sx={{
          mb: 4,
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
        + Submit New Ticket
      </Button>

      {tickets.length === 0 ? (
        <Typography sx={{ color: "#facc15" }}>
          No tickets found. You can submit a new ticket above.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} md={6} lg={4} key={ticket.id}>
              <Card
                sx={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {ticket.subject}
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {ticket.description.length > 100
                      ? ticket.description.slice(0, 100) + "..."
                      : ticket.description}
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
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

                  <Typography sx={{ mb: 1 }}>
                    <strong>Created:</strong>{" "}
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>

                  <Button
                    component={Link}
                    to={`/ticket/${ticket.id}`}
                    variant="outlined"
                    sx={{
                      mt: 2,
                      color: "#93c5fd",
                      borderColor: "#93c5fd",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(147,197,253,0.1)",
                        borderColor: "#60a5fa",
                      },
                    }}
                  >
                    View Details →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

