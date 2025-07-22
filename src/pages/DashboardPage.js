// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import BackgroundVideo from "../components/BackgroundVideo";

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [tenantStatus, setTenantStatus] = useState("Healthy");
  const [input, setInput] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/get-tickets");
        const data = await response.json();
        setTickets(data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleAskAssistant = async () => {
    if (!input) return;
    setLoadingReply(true);
    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setAssistantReply(data.reply || "No response.");
    } catch (error) {
      setAssistantReply("Error getting reply.");
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <>
      <BackgroundVideo />
      <Box sx={{ p: 4, color: "#fff", position: "relative", zIndex: 1 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          Client Dashboard
        </Typography>

        {/* Tenant Status */}
        <Card
          sx={{
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            borderRadius: 3,
            color: "#fff",
            mb: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Tenant Status
            </Typography>
            <Chip
              label={tenantStatus}
              sx={{
                backgroundColor:
                  tenantStatus === "Healthy" ? "#22c55e" : "#facc15",
                color: "#000",
                fontWeight: "bold",
              }}
            />
          </CardContent>
        </Card>

        {/* Submitted Tickets */}
        <Card
          sx={{
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            borderRadius: 3,
            color: "#fff",
            mb: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Submitted Tickets
            </Typography>
            {tickets.length === 0 ? (
              <Typography>No tickets submitted.</Typography>
            ) : (
              tickets.map((ticket) => (
                <Box
                  key={ticket.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <Typography>
                    <strong>Subject:</strong> {ticket.subject}
                  </Typography>
                  <Typography>
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
                  <Typography variant="body2">
                    Created At:{" "}
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>

        {/* GPT Chat Assistant */}
        <Card
          sx={{
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            borderRadius: 3,
            color: "#fff",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Ask GPT Assistant
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{
                input: { color: "#fff" },
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: "#fff",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAskAssistant}
              disabled={loadingReply}
              sx={{
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" },
                color: "#fff",
                mb: 2,
                borderRadius: 2,
                px: 3,
              }}
            >
              Ask
            </Button>
            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {assistantReply}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

