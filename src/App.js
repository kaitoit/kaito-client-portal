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

  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return (
      <div className="loading-indicator">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* video now uses a CSS class */}
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
      </video>

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
