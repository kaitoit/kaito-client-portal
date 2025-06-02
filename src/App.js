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

  // Show a simple loading state while MSAL processes the redirect
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <>
      {/* 1. Video background */}
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
      </video>

      {/* 2. Main container (allows scrolling if needed) */}
      <div className="main-container">
        {/* 3. Overlay behind the card so video is dimmed */}
        <div className="page-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/submit"
              element={
                isAuthenticated ? (
                  <SubmitTicketPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/" : "/login"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}


