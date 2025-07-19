// src/pages/SubmitTicketPage.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";

export default function SubmitTicketPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description }),
      });
      if (!res.ok) throw new Error("Failed to submit ticket");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 4, color: "#fff" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Submit a Ticket
      </Typography>

      <Card
        sx={{
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          maxWidth: 600,
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                color: "#fff",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#888",
              },
              "& .MuiInputLabel-root": {
                color: "#ccc",
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                color: "#fff",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#888",
              },
              "& .MuiInputLabel-root": {
                color: "#ccc",
              },
            }}
          />
          {error && (
            <Typography sx={{ color: "#f87171", mb: 2 }}>{error}</Typography>
          )}
          {submitted ? (
            <Typography sx={{ color: "#22c55e" }}>
              ✅ Ticket submitted successfully!
            </Typography>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
                color: "#fff",
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
              }}
            >
              Submit Ticket
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

