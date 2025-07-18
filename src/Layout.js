// src/Layout.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";

import bgVideo from "./assets/trees.mp4"; // Adjust path if needed
import logo from "./assets/logo512.png";  // Adjust if needed

export default function Layout({ children }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const username = accounts[0]?.username || "User";

  return (
    <>
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* AppBar Header */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={logo}
            alt="Kaito IT Logo"
            onClick={handleDashboard}
            sx={{ cursor: "pointer", width: 40, height: 40 }}
            variant="rounded"
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer", userSelect: "none" }}
            onClick={handleDashboard}
          >
            Kaito IT Portal
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", userSelect: "none" }}
            >
              {username}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              size="small"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content container */}
      <Box
        component="main"
        sx={{
          maxWidth: 960,
          margin: "2rem auto",
          padding: 2,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 2,
          boxShadow: 3,
          minHeight: "calc(100vh - 80px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </>
  );
}

