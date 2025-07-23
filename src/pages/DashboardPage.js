// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";


export default function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [services] = useState([
    { name: "Email", description: "Sending and receiving emails", status: "OK" },
    { name: "File Access", description: "Accessing shared files and cloud storage", status: "OK" },
    { name: "Device Security", description: "Antivirus, updates, and compliance", status: "OK" },
    { name: "Remote Access", description: "Connecting from home or offsite", status: "Issue" },
  ]);

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Chat assistant state (just like TicketDetailsPage)
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Load tickets
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      setLoadingTickets(true);
      try {
        const res = await fetch("/api/get-tickets");
        if (res.ok) {
          setTickets(await res.json());
        } else {
          console.error("Failed to fetch tickets");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTickets(false);
      }
    })();
  }, [isAuthenticated, navigate]);

  // Chat assistant submit handler
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory((h) => [...h, { role: "user", content: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json().catch(() => null);
      const botReply = data?.reply || "Sorry, something went wrong.";
      setChatHistory((h) => [...h, { role: "assistant", content: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory((h) => [...h, { role: "assistant", content: "Network error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const hasIssue = services.some((s) => s.status !== "OK");

  return (
    <Box>
      {/* System Status */}
      <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
        Kaito IT System Dashboard
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {hasIssue ? (
          <span style={{ color: "orange", fontWeight: "bold" }}>
            ⚠️ Some systems are experiencing issues.
          </span>
        ) : (
          <span style={{ color: "limegreen", fontWeight: "bold" }}>
            ✅ All systems are operational.
          </span>
        )}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#111",
          borderRadius: 3,
          p: 2,
          mb: 4,
          color: "#fff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: "#66aaff" }}>
          Service Status Overview
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "#333" }} />
        <List disablePadding>
          {services.map((svc, i) => (
            <ListItem
              key={i}
              sx={{
                backgroundColor: "#1c1c1c",
                mb: 1,
                borderRadius: 1,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>{svc.name}</Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  {svc.description}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: svc.status === "OK" ? "limegreen" : "orange",
                  fontWeight: "bold",
                }}
              >
                {svc.status}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Submitted Tickets */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#111",
          borderRadius: 3,
          p: 2,
          mb: 4,
          color: "#fff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: "#66aaff" }}>
          Submitted Support Tickets
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "#333" }} />

        {loadingTickets ? (
          <CircularProgress size={24} />
        ) : tickets.length === 0 ? (
          <Typography>No tickets submitted yet.</Typography>
        ) : (
          <List disablePadding>
            {tickets.map((t) => (
              <ListItem
                key={t.id}
                sx={{
                  backgroundColor: "#1e1e1e",
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <Button
                    component={Link}
                    to={`/ticket/${t.id}`}
                    size="small"
                    sx={{ color: "#06d6a0", textTransform: "none" }}
                  >
                    View & Reply
                  </Button>
                }
              >
                <ListItemText
                  primary={t.subject || "No subject"}
                  secondary={t.description}
                  primaryTypographyProps={{ color: "#66aaff", fontWeight: "bold" }}
                  secondaryTypographyProps={{ color: "#ccc" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* GPT Chat Assistant (same look as TicketDetailsPage) */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#111",
          borderRadius: 3,
          p: 3,
          color: "#fff",
        }}
      >
     <Typography variant="h6" gutterBottom>
    Kaito IT Chat Assistant  <Typography
    variant="caption"
    sx={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}
  >
    Powered by OpenAI
  </Typography>
  </Typography>
        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            p: 2,
            borderRadius: 2,
            height: 200,
            overflowY: "auto",
            mb: 2,
          }}
        >
          {chatHistory.map((msg, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: msg.role === "user" ? "#66aaff" : "#06d6a0",
                }}
              >
                {msg.role === "user" ? "You" : "Assistant"}:
              </Typography>
              <Typography variant="body2">{msg.content}</Typography>
            </Box>
          ))}
          {chatLoading && (
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              Assistant is typing…
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            placeholder="Ask something..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            sx={{
              backgroundColor: "#222",
              borderRadius: 1,
              "& .MuiInputBase-root": { color: "#fff" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleChatSubmit}
            disabled={chatLoading || !chatInput.trim()}
            sx={{ backgroundColor: "#06d6a0" }}
          >
            {chatLoading ? "…" : "Ask"}
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="caption" color="#aaa">
          © 2025 Kaito IT
        </Typography>
      </Box>
    </Box>
  );
}



