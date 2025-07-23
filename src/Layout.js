// src/Layout.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import bgVideo from "./assets/trees.mp4";
import logo from "./assets/logo512.png";

export default function Layout({ children }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const username = accounts[0]?.username || "User";

  // Determine if we should show the “back” button
  const showBackButton = location.pathname !== "/";

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
          zIndex: -2,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Fixed header */}
      <AppBar
        position="fixed"                       /* make it stick */
        sx={{
          backgroundColor: "#111",             /* solid black */
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* Optional “Back to Dashboard” button */}
          {showBackButton && (
            <Tooltip title="Back to Dashboard">
              <IconButton
                color="inherit"
                onClick={() => navigate("/")}
                sx={{ mr: 1 }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Logo */}
          <Avatar
            src={logo}
            alt="Kaito IT Logo"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", width: 40, height: 40 }}
            variant="rounded"
          />

          {/* Title */}
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ flexGrow: 1, cursor: "pointer", color: "#fff" }}
          >
            Kaito IT Portal
          </Typography>

          {/* Username */}
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            {username}
          </Typography>

          {/* Logout */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => instance.logoutRedirect()}
            size="small"
            sx={{
              borderColor: "#444",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content: push down by header height */}
      <Box
        component="main"
        sx={{
          backgroundColor: "#111",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.2)",
          padding: 3,
          color: "#fff",
          minHeight: "calc(100vh - 80px)",
          margin: "2rem auto",
          maxWidth: 960,
          position: "relative",
          zIndex: 1,
          pt: "80px",              /* space for fixed header */
        }}
      >
        {children}
      </Box>
    </>
  );
}

