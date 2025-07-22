import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";

export default function RepliesPage() {
  const { id: ticketId } = useParams();
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await fetch(`/api/get-replies?id=${ticketId}`);
        const data = await res.json();
        setReplies(data || []);
      } catch (err) {
        setError("Failed to load replies");
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [ticketId]);

  const handleSendReply = async () => {
    if (!newReply.trim()) return;

    try {
      const res = await fetch("/api/reply-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, message: newReply }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      setReplies([...replies, { message: newReply, timestamp: new Date().toISOString() }]);
      setNewReply("");
    } catch (err) {
      setError("Reply failed.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
        Replies for Ticket #{ticketId}
      </Typography>

      {loading ? (
        <Typography sx={{ color: "white" }}>Loading replies...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {replies.length === 0 ? (
            <Typography sx={{ color: "white" }}>No replies yet.</Typography>
          ) : (
            replies.map((reply, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {reply.message}
                  </Typography>
                  <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />
                  <Typography variant="caption">
                    {new Date(reply.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Reply Form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 4,
          backgroundColor: "rgba(255, 255, 255, 0.07)",
          borderRadius: 2,
          p: 3,
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Send a Reply
        </Typography>
        <TextField
          multiline
          rows={4}
          ful
