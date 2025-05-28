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
  <video
    id="bg-video"
    autoPlay
    muted
    loop
    playsInline
    style={{
      position: "fixed",
      right: 0,
      bottom: 0,
      minWidth: "100%",
      minHeight: "100%",
      objectFit: "cover",
      zIndex: 1,
    }}
  >
    <source src="/trees.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <main style={{ position: "relative", zIndex: 10 }}>
    <AppRoutes />
  </main>
</MsalProvider>
  );
}

export default App;

