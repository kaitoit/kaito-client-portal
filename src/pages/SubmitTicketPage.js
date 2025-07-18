// src/pages/SubmitTicketPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function SubmitTicketPage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [component, setComponent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory, chatLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, description, component, priority }),
      });

      if (response.ok) {
        setMessage("✅ Ticket submitted successfully.");
        setName("");
        setEmail("");
        setDescription("");
        setComponent("");
        setPriority("normal");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(`❌ Failed to submit ticket. ${errorData?.error || "Unknown error."}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

      const data = await res.json().catch(() => null);

      if (res.ok && data?.reply) {
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
        maxWidth: 700,
        margin: "2rem auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Submit a Support Ticket
      </Typography>
      <Typography mb={3}>Fill out the form below to create a new support request.</Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mb: 3 }}>
        <TextField
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          rows={5}
          margin="normal"
        />
        <TextField
          label="Component (optional)"
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          {submitting ? "Submitting..." : "Submit Ticket"}
        </Button>
      </Box>

      {message && (
        <Typography
          variant="body1"
          color={message.startsWith("✅") ? "success.main" : "error.main"}
          sx={{ fontWeight: "bold", whiteSpace: "pre-wrap", mb: 3 }}
        >
          {message}
        </Typography>
      )}

      <Box sx={{ borderTop: 1, borderColor: "divider", pt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Describe your issue here to get suggestions
        </Typography>
        <Typography mb={2} color="text.secondary">
          Kaito IT Chat Assistant
        </Typography>

        <Paper
          ref={chatBoxRef}
          sx={{
            maxHeight: 250,
            overflowY: "auto",
            p: 2,
            bgcolor: "background.default",
            mb: 2,
          }}
        >
          {chatHistory.map((msg, i) => (
            <Box key={i} mb={1}>
              <Typography
                component="span"
                fontWeight="bold"
                color={msg.role === "user" ? "primary.main" : "secondary.main"}
              >
                {msg.role === "user" ? "You" : "Assistant"}:
              </Typography>{" "}
              <Typography component="span">{msg.content}</Typography>
            </Box>
          ))}
          {chatLoading && (
            <Typography fontStyle="italic" color="text.secondary">
              Assistant is typing...
            </Typography>
          )}
        </Paper>

        <Box component="form" onSubmit={handleChatSubmit} sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="What can we help you with?"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={chatLoading}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={chatLoading}
            sx={{ width: "6rem" }}
          >
            {chatLoading ? <CircularProgress size={20} /> : "Ask"}
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" mt={4}>
        © 2025 Kaito IT
      </Typography>
    </Box>
  );
}

