// src/App.js
import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";

export default function App() {
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Show a simple loading state while MSAL is initializing or handling redirect
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <>
      {/* 1) Background video (always visible behind content) */}
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
      </video>

      {/* 2) main-container is transparent, so video shows through */}
      <div className="main-container">
        <Routes>
          {/* Root route: if signed in, show Dashboard; if not, go to /login */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <DashboardPage />
                : <Navigate to="/login" replace />
            }
          />

          {/* Login route always available */}
          <Route path="/login" element={<LoginPage />} />

          {/* Submit Ticket (protected) */}
          <Route
            path="/submit"
            element={
              isAuthenticated
                ? <SubmitTicketPage />
                : <Navigate to="/login" replace />
            }
          />

          {/* Catch-all -> either / or /login */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </>
  );
}

