// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Route protection wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      {/* Redirect from "/" to "/login" if not authenticated */}
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
          <ProtectedRoute>
            <SubmitTicketPage />
          </ProtectedRoute>
        }
      />
      {/* Optional: catch all unmatched routes and redirect */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppRoutes />
    </MsalProvider>
  );
}

export default App;

