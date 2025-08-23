// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MechanicProfile from "./pages/MechanicProfile";
import MechanicRequests from "./pages/MechanicRequests";

const App = () => {
  const token = localStorage.getItem("token");
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin}  />} />
        <Route path="/" element={<Home token={token} onLogout={handleLogout} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Login onLogin={handleLogin}  />}
        />
        <Route
          path="/mechanic/profile"
          element={token ? <MechanicProfile /> : <Login onLogin={handleLogin}  />}
        />
        <Route
          path="/mechanic/requests"
          element={token ? <MechanicRequests /> : <Login onLogin={handleLogin}  />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
