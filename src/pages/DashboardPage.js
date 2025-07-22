// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Chip,
  TextField,
} from "@mui/material";

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
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

  const handleChatSubmit = async () => {
    try {
      const res = await fetch("/api/gpt-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatResponse(data.reply || "No reply received.");
    } catch (err) {
      setChatResponse("Error contacting GPT assistant.");
    }
  };

  return (
    <Box sx={{ p: 4, color: "#fff" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      {/* Tenant Status */}
      <Card
        sx={{
          mb: 4,
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Tenant Service Status
          </Typography>
          <Typography>Status: <Chip label="Healthy" sx={{ backgroundColor: "#22c55e", color: "#fff", ml: 1 }} /></Typography>
          <Typography sx={{ mt: 1 }}>
            Azure AD, Exchange Online, SharePoint: All Operational
          </Typography>
        </CardContent>
      </Card>

      {/* Submitted Tickets */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Submitted Tickets
      </Typography>

      {loading ? (
        <Typography sx={{ color: "#ccc" }}>Loading tickets...</Typography>
      ) : error ? (
        <Typography sx={{ color: "#f87171" }}>{error}</Typography>
      ) : tickets.length === 0 ? (
        <Typography>No tickets found.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket.id}>
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{ticket.subject}</Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={ticket.status}
                      sx={{
                        ml: 1,
                        backgroundColor:
                          ticket.status === "Open" ? "#facc15" : "#22c55e",
                        color: "#fff",
                      }}
                    />
                  </Typography>
                  <Typography variant="body2">
                    Created:{" "}
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    href={`/ticket/${ticket.id}`}
                    sx={{
                      color: "#fff",
                      borderColor: "#2563eb",
                      "&:hover": {
                        backgroundColor: "#2563eb",
                        color: "#fff",
                      },
                      textTransform: "none",
                    }}
                  >
                    View Details →
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* GPT Assistant */}
      <Card
        sx={{
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            GPT Chat Assistant
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything about your IT environment..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            sx={{
              mb: 2,
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2563eb" },
                "&:hover fieldset": { borderColor: "#3b82f6" },
              },
            }}
          />
          <Button
            onClick={handleChatSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
              color: "#fff",
              textTransform: "none",
            }}
          >
            Submit
          </Button>
          {chatResponse && (
            <Typography sx={{ mt: 2, color: "#a5f3fc" }}>
              Response: {chatResponse}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

