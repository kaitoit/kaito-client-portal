// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/get-tickets");
        const data = await response.json();
        setTickets(data || []);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoadingTickets(false);
      }
    };
    fetchTickets();
  }, []);

  const handleChatSubmit = async () => {
    if (!input.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: input }];
    setChatMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data?.reply) {
        setChatMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("Error calling assistant:", error);
    }
  };

  return (
    <Box sx={{ p: 4, color: "#fff" }}>
      <Stack spacing={4}>
        {/* Tenant Health Section */}
        <Card
          sx={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Tenant Health Overview
            </Typography>
            <Typography sx={{ color: "#ccc" }}>
              You don't currently have an active Azure tenant to monitor.
              Once connected, this panel will display service and resource health.
            </Typography>
          </CardContent>
        </Card>

        {/* Tickets Section */}
        <Card
          sx={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Submitted Tickets
            </Typography>
            {loadingTickets ? (
              <Typography>Loading...</Typography>
            ) : tickets.length === 0 ? (
              <Typography>No tickets found.</Typography>
            ) : (
              <List>
                {tickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <ListItem
                      button
                      component="a"
                      href={`/ticket/${ticket.id}`}
                      sx={{ color: "#fff" }}
                    >
                      <ListItemText
                        primary={ticket.subject}
                        secondary={`Created: ${new Date(ticket.createdAt).toLocaleString()}`}
                      />
                      <Chip
                        label={ticket.status}
                        sx={{
                          ml: 2,
                          backgroundColor:
                            ticket.status === "Open" ? "#facc15" : "#22c55e",
                          color: "#000",
                        }}
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Chat Assistant Section */}
        <Card
          sx={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Ask Kaito AI
            </Typography>

            <List sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
              {chatMessages.map((msg, idx) => (
                <ListItem key={idx} sx={{ color: "#fff" }}>
                  <ListItemText
                    primary={`${msg.role === "user" ? "You" : "Assistant"}:`}
                    secondary={msg.content}
                    primaryTypographyProps={{ fontWeight: "bold", color: "#ccc" }}
                    secondaryTypographyProps={{ whiteSpace: "pre-wrap" }}
                  />
                </ListItem>
              ))}
            </List>

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                }}
              />
              <Button
                onClick={handleChatSubmit}
                sx={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                  boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Ask
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

