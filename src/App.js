// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";

export default function App() {
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // If MSAL is still handling a redirect, show a loader
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return (
      <div style={{
        color: "white",
        textAlign: "center",
        marginTop: "2rem",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Background video */}
      <video
        id="bg-video"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          opacity: 0.6,
        }}
      >
        <source src="/trees.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* App routes */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <DashboardPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/submit"
          element={
            isAuthenticated
              ? <SubmitTicketPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}
