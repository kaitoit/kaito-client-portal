// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import Layout from "./Layout";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "transparent",    // page bg transparent for video
    },
    primary: { main: "#3a86ff" },
    secondary: { main: "#06d6a0" },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
});

export default function App() {
  const { accounts, inProgress } = useMsal();
  const isAuthenticated = accounts && accounts.length > 0;

  // MSAL is doing its startup/redirect dance
  if (inProgress !== "none") {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          typography: "h6",
          color: "#fff",
        }}
      >
        Loading…
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* makes the body transparent */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Layout>
                  <DashboardPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/submit"
            element={
              isAuthenticated ? (
                <Layout>
                  <SubmitTicketPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/ticket/:id"
            element={
              isAuthenticated ? (
                <Layout>
                  <TicketDetailsPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}
