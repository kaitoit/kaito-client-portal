import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitTicketPage from './pages/SubmitTicketPage';
import TicketDetailsPage from './pages/TicketDetailsPage';

export default function App() {
  const { accounts, inProgress } = useMsal();
  const isAuthenticated = accounts.length > 0;

  // Show loading indicator while MSAL is handling redirect or initializing
  if (inProgress !== 'none') {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <Routes>
      {/* Login Route (does not use Layout) */}
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />

      {/* Protected Routes inside Layout */}
      <Route element={<Layout />}>
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
        <Route
          path="/submit"
          element={
            isAuthenticated ? (
              <SubmitTicketPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/ticket/:id"
          element={
            isAuthenticated ? (
              <TicketDetailsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
