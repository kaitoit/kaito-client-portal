// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Stack,
} from "@mui/material";

export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  // Example static service status (you can fetch real status if available)
  const [services] = useState([
    { name: "Email", description: "Sending and receiving emails", status: "OK" },
    {
      name: "File Access",
      description: "Accessing shared files and cloud storage",
      status: "OK",
    },
    {
      name: "Device Security",
      description: "Antivirus, updates, and compliance",
      status: "OK",
    },
    { name: "Remote Access", description: "Connecting from home or offsite", status: "Issue" },
  ]);

  const hasIssue = services.some((service) => service.status !== "OK");

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);

  // Chat assistant states
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchTickets = async () => {
      setLoadingTickets(true);
      setTicketsError(null);
      try {
        const res = await fetch("/api/get-tickets");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        setTicketsError("Failed to load tickets.");
        console.error(err);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTickets();
  }, [isAuthenticated, navigate]);

  // Chat form submit handler
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

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();

      if (data?.reply) {
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Assistant error." }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Network error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Box
      sx={{
        color: "#fff",
        backdropFilter: "blur(14px)",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        borderRadius: 3,
        p: 4,
        mb: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Kaito IT System Dashboard
      </Typography>

      {/* System Status */}
      <Typography variant="h6" gutterBottom>
        Service Status Overview
      </Typography>
      <Stack spacing={2} mb={3}>
        {services.map((service, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {service.name}
              </Typography>
              <Typography variant="body2">{service.description}</Typography>
            </Box>
            <Chip
              label={service.status}
              color={service.status === "OK" ? "success" : "warning"}
              sx={{ fontWeight: "bold" }}
            />
          </Box>
        ))}
      </Stack>

      <Typography
        sx={{ color: hasIssue ? "orange" : "limegreen", fontWeight: "bold", mb: 3 }}
      >
        {hasIssue ? "⚠️ Some systems are experiencing issues." : "✅ All systems are operational."}
      </Typography>

      {/* Support Tickets */}
      <Typography variant="h6" gutterBottom>
        Submitted Support Tickets
      </Typography>

      {loadingTickets ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : ticketsError ? (
        <Typography color="error">{ticketsError}</Typography>
      ) : tickets.length === 0 ? (
        <Typography>No tickets submitted yet.</Typography>
      ) : (
        <Stack spacing={2} mb={4}>
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {ticket.subject || "(No subject)"}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {ticket.description}
                  </Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component={RouterLink}
                    to={`/ticket/${ticket.id}`}
                    sx={{
                      color: "#fff",
                      borderColor: "#fff",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                    }}
                  >
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Button
        variant="contained"
        onClick={() => navigate("/submit")}
        sx={{
          mb: 4,
          backgroundColor: "#2563eb",
          "&:hover": { backgroundColor: "#1d4ed8" },
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Submit Support Request
      </Button>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 4 }} />

      {/* Chat Assistant */}
      <Typography variant="h6" gutterBottom>
        Kaito IT Chat Assistant
      </Typography>
      <Box
        component="form"
        onSubmit={handleChatSubmit}
        sx={{
          display: "flex",
          gap: 1,
          flexDirection: "column",
          maxWidth: 600,
          mb: 2,
        }}
      >
        <TextField
          variant="filled"
          placeholder="Ask a question or describe your issue"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          fullWidth
          InputProps={{
            sx: {
              bgcolor: "rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: 1,
            },
          }}
          InputLabelProps={{ style: { color: "#ccc" } }}
          disabled={chatLoading}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={chatLoading || !chatInput.trim()}
          sx={{ alignSelf: "flex-start" }}
        >
          {chatLoading ? "..." : "Ask"}
        </Button>
      </Box>

      <Box
        sx={{
          maxHeight: 200,
          overflowY: "auto",
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          p: 2,
          color: "#fff",
        }}
      >
        {chatHistory.length === 0 && (
          <Typography color="rgba(255,255,255,0.7)" fontStyle="italic">
            Chat responses will appear here...
          </Typography>
        )}
        {chatHistory.map((msg, i) => (
          <Box
            key={i}
            sx={{
              mb: 1,
              whiteSpace: "pre-wrap",
              color: msg.role === "user" ? "#60a5fa" : "#bbf7d0",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
            {msg.content}
          </Box>
        ))}
      </Box>
    </Box>
  );
}


