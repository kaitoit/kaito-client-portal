// src/Layout.jsx
import React, { useEffect } from "react";
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
import HomeIcon from "@mui/icons-material/Home"; // <-- make sure this matches

import bgVideo from "./assets/trees.mp4";
import logo from "./assets/logo512.png";

export default function Layout({ children }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const username = accounts[0]?.username || "User";

  // Show the back‑to‑dashboard icon on every route except "/"  
  const showBackButton = location.pathname !== "/";
  // DEBUG
  useEffect(() => {
    console.log("Layout: current path =", location.pathname, "showBackButton =", showBackButton);
  }, [location, showBackButton]);

  return (
    <>
      {/* Full‑screen background video */}
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
        position="fixed"
        sx={{
          backgroundColor: "#111",
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Back to Dashboard button */}
          {showBackButton && (
            <Tooltip title="Back to Dashboard">
              <IconButton
                onClick={() => navigate("/")}
                color="inherit"
                sx={{ color: "#fff" }}  /* force white */
              >
                <HomeIcon fontSize="medium" sx={{ color: "#fff" }} />
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

          {/* User name */}
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
          pt: "64px",               /* header height */
          backgroundColor: "#111",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.2)",
          p: 3,
          color: "#fff",
          minHeight: "calc(100vh - 64px - 32px)", /* subtract header + margins */
          m: "2rem auto",
          maxWidth: 960,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </>
  );
}


