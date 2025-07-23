// src/pages/TicketDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function TicketDetailsPage() {
  const { id: ticketId } = useParams();
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const userEmail = accounts?.[0]?.username || "";

  const [ticket, setTicket] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(true);

  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(true);

  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch ticket
  useEffect(() => {
    if (!ticketId || !userEmail) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/get-ticket?id=${ticketId}&email=${encodeURIComponent(userEmail)}`
        );
        if (!res.ok) throw new Error(await res.text());
        setTicket(await res.json());
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        setLoadingTicket(false);
      }
    })();
  }, [ticketId, userEmail]);

  // Fetch replies
  useEffect(() => {
    if (!ticketId) return;
    (async () => {
      setLoadingReplies(true);
      try {
        const res = await fetch(`/api/get-replies?ticketId=${ticketId}`);
        if (!res.ok) throw new Error("Failed to load replies");
        const data = await res.json();
        setReplies(data.replies || []);
      } catch (err) {
        console.error("Error fetching replies:", err);
      } finally {
        setLoadingReplies(false);
      }
    })();
  }, [ticketId]);

  // Send reply
  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/reply-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          sender: userEmail,
          message: replyMessage.trim(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setReplyMessage("");
      // refresh replies
      const r2 = await fetch(`/api/get-replies?ticketId=${ticketId}`);
      const d2 = await r2.json();
      setReplies(d2.replies || []);
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setSendingReply(false);
    }
  };

  if (loadingTicket) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!ticket) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Ticket not found or access denied.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Return link */}
      <Button
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        sx={{
          color: "#66aaff",
          mb: 2,
          textTransform: "none",
        }}
      >
        Return to Dashboard
      </Button>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#111",
          borderRadius: 3,
          p: 3,
          color: "#fff",
        }}
      >
        {/* Ticket Info */}
        <Typography variant="h5">{ticket.subject}</Typography>
        <Divider sx={{ my: 2, borderColor: "#333" }} />
        <Typography sx={{ mb: 1 }}>
          <strong>Description:</strong> {ticket.description}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Status:</strong> {ticket.status}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Submitted:</strong>{" "}
          {new Date(ticket.submittedAt).toLocaleString()}
        </Typography>

        {/* Replies */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Conversation
        </Typography>
        {loadingReplies ? (
          <CircularProgress size={20} />
        ) : replies.length === 0 ? (
          <Typography>No replies yet.</Typography>
        ) : (
          <List dense sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
            {replies.map((r) => (
              <ListItem key={r.id} alignItems="flex-start">
                <ListItemText
                  primary={`${r.sender} • ${new Date(r.timestamp).toLocaleString()}`}
                  secondary={r.message}
                  primaryTypographyProps={{ color: "#ddd", fontSize: 12 }}
                  secondaryTypographyProps={{ color: "#eee" }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Reply Input */}
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Type your reply..."
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          sx={{
            backgroundColor: "#222",
            borderRadius: 1,
            mb: 1,
            "& .MuiInputBase-root": { color: "#fff" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleReply}
          disabled={sendingReply || !replyMessage.trim()}
          sx={{ backgroundColor: "#3a86ff" }}
        >
          {sendingReply ? "Sending…" : "Send Reply"}
        </Button>
      </Paper>
    </Box>
  );
}



