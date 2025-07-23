import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function MeetingRequest() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!date || !time) {
      setError("Please select date and time.");
      return;
    }
    setError(null);
    try {
      const res = await fetch("/api/request-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, message }),
      });
      if (!res.ok) throw new Error("Failed to send meeting request");
      setSubmitted(true);
      setDate("");
      setTime("");
      setMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ mb: 6, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Request a Teams Meeting
      </Typography>
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        sx={{ mr: 2, mb: 2 }}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        label="Time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        label="Message (optional)"
        multiline
        rows={3}
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {submitted ? (
        <Typography sx={{ color: "green" }}>
          Meeting request sent! I will get back to you shortly.
        </Typography>
      ) : (
        <Button variant="contained" onClick={handleSubmit}>
          Submit Meeting Request
        </Button>
      )}
    </Box>
  );
}
