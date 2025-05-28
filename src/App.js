import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (inProgress === "startup" || inProgress === "handleRedirect") {
    // Show a loading indicator while MSAL processes the redirect
    return <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
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

function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      {/* Optional: background video or other global UI here */}
      <AppRoutes />
    </MsalProvider>
  );
}

export default App;


