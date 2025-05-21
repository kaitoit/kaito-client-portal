import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitTicketPage from "./pages/SubmitTicketPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/submit"
        element={
          isAuthenticated ? <SubmitTicketPage /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;

