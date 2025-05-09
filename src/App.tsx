import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import EmailVerification from "./pages/EmailVerification";
import Dashboard from "./pages/DashBoard";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protected routes - only accessible if logged in AND verified */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireVerified={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
export default App;
