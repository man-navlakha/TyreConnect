// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MechanicProfile from "./pages/MechanicProfile";
import MechanicRequests from "./pages/MechanicRequests";
import ServiceRequests from "./pages/ServiceRequests";
import CreateRequest from "./pages/CreateRequest";
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mechanic/profile"
          element={
            <ProtectedRoute>
              <MechanicProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mechanic/requests"
          element={
            <ProtectedRoute>
              <MechanicRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <ServiceRequests token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/req"
          element={
            <ProtectedRoute>
              <CreateRequest token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
