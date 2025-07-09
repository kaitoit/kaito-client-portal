import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitTicketPage from './pages/SubmitTicketPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import Layout from './Layout';

export default function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/submit"
        element={isAuthenticated ? <Layout><SubmitTicketPage /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/ticket/:id"
        element={isAuthenticated ? <Layout><TicketDetailsPage /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={<LoginPage />} // ✅ no Layout here
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
}


