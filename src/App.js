// src/App.js
import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import TicketDetailsPageWrapper from "./pages/TicketDetailsPageWrapper";
import Layout from "./Layout";

export default function App() {
  const { accounts, inProgress } = useMsal();
  const isAuthenticated = accounts && accounts.length > 0;

  if (inProgress !== "none") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Layout><DashboardPage /></Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/submit"
        element={
          isAuthenticated ? (
            <Layout><SubmitTicketPage /></Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
<Route
  path="/ticket/:id"
  element={
    isAuthenticated ? (
      <Layout><TicketDetailsPageWrapper /></Layout>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
      <Route
        path="/ticket/:id"
        element={
          isAuthenticated ? (
            <Layout><TicketDetailsPage /></Layout>
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
  );
}



