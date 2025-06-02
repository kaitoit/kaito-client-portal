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

  console.log("🔔 App → inProgress:", inProgress, "isAuthenticated:", isAuthenticated);

  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <>
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
      </video>
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
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>
    </>
  );
}

