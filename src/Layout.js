// src/Layout.jsx
import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from "@mui/material";

import bgVideo from "./assets/trees.mp4";
import logo from "./assets/logo512.png";

export default function Layout({ children }) {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
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
          zIndex: -2,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Fixed solid‑black header */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#111",
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={logo}
            alt="Kaito IT"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", width: 40, height: 40 }}
            variant="rounded"
          />

          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ flexGrow: 1, cursor: "pointer", color: "#fff" }}
          >
            Kaito IT Portal
          </Typography>

          <Typography variant="body2" sx={{ color: "#ccc" }}>
            {username}
          </Typography>

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

      {/* Main content container, pushed below header */}
      <Box
        component="main"
        sx={{
          pt: "64px", // header height
          backgroundColor: "#111",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.2)",
          p: 3,
          color: "#fff",
          minHeight: "calc(100vh - 64px - 32px)",
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




