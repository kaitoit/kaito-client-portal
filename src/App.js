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

  // Show a loader while MSAL is initializing/handling redirect
  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <>
      {/* 1) Background video, once for the entire app */}
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
      </video>

      {/* 2) Main container wraps the Routes */}
      <div className="main-container">
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
            element={
              <Navigate to={isAuthenticated ? "/" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </>
  );
}


