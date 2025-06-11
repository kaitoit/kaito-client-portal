// src/App.js
import './App.css';
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";
import Layout from "./Layout";

export default function App() {
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (inProgress === "startup" || inProgress === "handleRedirect") {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <Routes>
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
        path="/login"
        element={<Layout><LoginPage /></Layout>}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

