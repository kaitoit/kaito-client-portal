// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
} from "@mui/material";

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/get-tickets");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err.message);
        setError("Could not load tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <Box sx={{ p: 4, color: "#fff" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      {loading ? (
        <Typography sx={{ color: "#fff" }}>Loading tickets...</Typography>
      ) : error ? (
        <Typography sx={{ color: "#f87171" }}>{error}</Typography>
      ) : tickets.length === 0 ? (
        <Typography sx={{ color: "#ccc" }}>No tickets found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket.id}>
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {ticket.subject}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>ID:</strong> {ticket.id}
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
                  <Typography variant="body2" color="gray">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </CardContent>

