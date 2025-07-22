// src/pages/SubmitTicketPage.js
import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";

export default function SubmitTicketPage() {
  const { accounts } = useMsal();
  const userEmail = accounts?.[0]?.username || "";
  const userName = accounts?.[0]?.name || "";

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [component, setComponent] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          subject,
          description,
          component,
          priority,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit ticket");
      }

      setSubmitted(true);
      setSubject("");
      setDescription("");
      setComponent("");
      setPriority("Medium");
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
            label="Name"
            variant="outlined"
            value={userName}
            disabled
            sx={textFieldStyle}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={userEmail}
            disabled
            sx={textFieldStyle}
          />
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={textFieldStyle}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={textFieldStyle}
          />
          <TextField
            fullWidth
            label="Component"
            variant="outlined"
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            sx={textFieldStyle}
          />
          <TextField
            fullWidth
            select
            label="Priority"
            variant="outlined"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={textFieldStyle}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </TextField>

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
              disabled={!subject.trim() || !description.trim()}
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
                mt: 2,
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

const textFieldStyle = {
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
};


