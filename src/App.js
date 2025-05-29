// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
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
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (inProgress === "startup" || inProgress === "handleRedirect") {
    // Show a loading indicator while MSAL processes the redirect
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
        Loading...
      </div>
    );
  }

  return (
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
          <ProtectedRoute>
            <SubmitTicketPage />
          </ProtectedRoute>
        }
      />
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
      {/* Background video for all pages */}
      <video
        id="bg-video"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,    // behind your content
          opacity: 0.6,  // dim for readability
        }}
      >
        <source src="/trees.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <AppRoutes />
    </MsalProvider>
  );
}

export default App;

