// src/pages/DashboardPage.js
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Link as MuiLink,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Tenant status example data
  const [tenantStatus, setTenantStatus] = useState({
    activeDirectory: "Healthy",
    fileStorage: "Healthy",
    security: "Issue",
  });

  // Tickets
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState(null);

  // Chat assistant state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Chat box ref to auto-scroll
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Fetch tickets from your existing API endpoint /api/get-tickets
    async function fetchTickets() {
      try {
        setLoadingTickets(true);
        const res = await fetch("/api/get-tickets");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        setTicketsError("Failed to load tickets.");
      } finally {
        setLoadingTickets(false);
      }
    }
    fetchTickets();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory, chatLoading]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();

      if (data.reply) {
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Assistant error." }]);
      }
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Network error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Box
      sx={{
        color: "#fff",
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        borderRadius: 3,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Tenant Status Section */}
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Tenant Service Health Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {Object.entries(tenantStatus).map(([service, status]) => (
            <Chip
              key={service}
              label={`${service.replace(/([A-Z])/g, " $1")}: ${status}`}
              color={status === "Healthy" ? "success" : "warning"}
              sx={{ fontWeight: "bold" }}
            />
          ))}
        </Box>
      </Box>

      {/* Tickets Section */}
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Submitted Support Tickets
        </Typography>
        {loadingTickets ? (
          <CircularProgress color="inherit" />
        ) : ticketsError ? (
          <Typography color="error">{ticketsError}</Typography>
        ) : tickets.length === 0 ? (
          <Typography>No tickets submitted yet.</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                }}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {ticket.subject || "No subject"}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>{ticket.description}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    Status:{" "}
                    <Chip
                      label={ticket.status}
                      size="small"
                      color={ticket.status === "Open" ? "warning" : "success"}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Chat Assistant Section */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Kaito IT Chat Assistant
        </Typography>

        <Box
          ref={chatBoxRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
            p: 2,
            mb: 2,
            maxHeight: 250,
            color: "#000",
          }}
        >
          {chatHistory.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              Ask your question below...
            </Typography>
          )}

          {chatHistory.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: 1,
                fontWeight: msg.role === "user" ? "bold" : "normal",
                color: msg.role === "user" ? "blue" : "black",
              }}
            >
              {msg.role === "user" ? "You: " : "Assistant: "}
              {msg.content}
            </Box>
          ))}

          {chatLoading && <Typography>Assistant is typing...</Typography>}
        </Box>

        <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "8px" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="What can we help you with?"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            type="submit"
            disabled={chatLoading}
            sx={{ px: 3 }}
          >
            {chatLoading ? "..." : "Ask"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

