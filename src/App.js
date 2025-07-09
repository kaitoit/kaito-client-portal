import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";

export default function App() {
  const { accounts, inProgress } = useMsal();
  const isAuthenticated = accounts.length > 0;

  if (inProgress !== "none") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={
        <Layout>
          <LoginPage />
        </Layout>
      } />

      {/* Protected routes */}
      <Route path="/" element={
        isAuthenticated ? (
          <Layout><DashboardPage /></Layout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="/submit" element={
        isAuthenticated ? (
          <Layout><SubmitTicketPage /></Layout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="/ticket/:id" element={
        isAuthenticated ? (
          <Layout><TicketDetailsPage /></Layout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}
