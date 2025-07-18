// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Stack,
  Alert,
  Link,
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

  const hasIssue = services.some((service) => service.status !== "OK");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/get-tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      }
    };

    fetchTickets();
  }, [isAuthenticated, navigate]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kaito IT System Dashboard
      </Typography>

      {hasIssue ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
         ⚠️ Some systems are experiencing issues.
        </Alert>
      ) : (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ All systems are operational.
        </Alert>
      )}

      {/* Service Status */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Service Status Overview
        </Typography>
        <List>
          {services.map((service, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <Chip
                  label={service.status}
                  color={service.status === "OK" ? "success" : "warning"}
                  size="small"
                />
              }
            >
              <ListItemText
                primary={service.name}
                secondary={service.description}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Support Tickets */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Submitted Support Tickets
        </Typography>
        {tickets.length === 0 ? (
          <Typography>No tickets submitted yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {tickets.map((ticket) => (
              <Paper
                key={ticket.id}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {ticket.subject || "No subject"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {ticket.description}
                </Typography>
                <Link
                  component={RouterLink}
                  to={`/ticket/${ticket.id}`}
                  underline="hover"
                  sx={{ fontWeight: "medium" }}
                >
                  View & Reply
                </Link>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={() => navigate("/submit")}
      >
        Submit Support Request
      </Button>
    </Box>
  );
}

