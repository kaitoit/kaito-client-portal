// src/Layout.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";

import bgVideo from "./assets/trees.mp4";
import logo from "./assets/logo512.png";

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
      {/* Video Background */}
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
          zIndex: -2,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Glassmorphic Header */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
        }}
      >
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
            sx={{ flexGrow: 1, cursor: "pointer", userSelect: "none", color: "#fff" }}
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
              sx={{
                borderColor: "rgba(255, 255, 255, 0.6)",
                color: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Glassmorphic Content Container */}
      <Box
        component="main"
        sx={{
          maxWidth: "960px",
          margin: "2rem auto",
          padding: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </>
  );
}

