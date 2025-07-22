import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function TicketDetailsPage() {
  const { id: ticketId } = useParams();
  const { accounts } = useMsal();
  const userEmail = accounts?.[0]?.username || "";

  const [ticket, setTicket] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(true);

  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(true);

  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Fetch ticket details
  useEffect(() => {
    if (!ticketId || !userEmail) return;

    const fetchTicket = async () => {
      try {
        const response = await fetch(
          `/api/get-ticket?id=${ticketId}&email=${encodeURIComponent(userEmail)}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket:", error.message);
      } finally {
        setLoadingTicket(false);
      }
    };

    fetchTicket();
  }, [ticketId, userEmail]);

  // Fetch replies for this ticket
  useEffect(() => {
    if (!ticketId) return;

    const fetchReplies = async () => {
      setLoadingReplies(true);
      try {
        const response = await fetch(`/api/get-replies?ticketId=${ticketId}`);
        if (!response.ok) {
          console.error("Failed to fetch replies");
          setReplies([]);
          return;
        }
        const data = await response.json();
        setReplies(data.replies || []);
      } catch (err) {
        console.error("Error fetching replies:", err);
      } finally {
        setLoadingReplies(false);
      }
    };

    fetchReplies();
  }, [ticketId]);

  // Handle submitting a reply
  const handleReply = async () => {
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const response = await fetch("/api/reply-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          from: userEmail,
          message: replyMessage.trim(),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      setReplyMessage("");
      // Refresh replies after successful send
      const updatedRepliesRes = await fetch(`/api/get-replies?ticketId=${ticketId}`);
      const updatedRepliesData = await updatedRepliesRes.json();
      setReplies(updatedRepliesData.replies || []);
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
          Ticket not found or you do not have access.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.07)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        p: 3,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#fff",
        mt: 4,
      }}
    >
      {/* Ticket info */}
      <Typography variant="h5" gutterBottom>
        Ticket: {ticket.subject}
      </Typography>
      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Description:</strong> {ticket.description}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Status:</strong> {ticket.status}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        <strong>Created At:</strong> {new Date(ticket.submittedAt).toLocaleString()}
      </Typography>

      {/* Replies section */}
      <Typography variant="h6" gutterBottom>
        Replies
      </Typography>
      {loadingReplies ? (
        <CircularProgress size={24} />
      ) : replies.length === 0 ? (
        <Typography>No replies yet.</Typography>
      ) : (
        <List sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
          {replies.map(({ id, from, message, timestamp }) => (
            <ListItem key={id} alignItems="flex-start" sx={{ mb: 1 }}>
              <ListItemText
                primary={
                  <>
                    <strong>{from}</strong> <small>({new Date(timestamp).toLocaleString()})</small>
                  </>
                }
                secondary={message}
                sx={{ color: "#eee" }}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Reply form */}
      <TextField
        label="Write a reply"
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
        sx={{
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: 1,
          "& .MuiInputBase-root": { color: "#fff" },
          mb: 1,
        }}
      />
      <Button
        variant="contained"
        onClick={handleReply}
        disabled={sendingReply || !replyMessage.trim()}
        sx={{ mt: 1 }}
      >
        {sendingReply ? "Sending..." : "Send Reply"}
      </Button>
    </Paper>
  );
}


