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
        <Route path="/verification" element={<EmailVerification />} />

        {/* Protected routes - only accessible if logged in AND verified */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireVerified={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Set the default/fallback route to EmailVerification */}
        <Route path="/verification" element={<EmailVerification />} />
        
        {/* Any other unknown routes redirect to EmailVerification */}
        <Route path="*" element={<Navigate to="/verification" replace />} />
      </Routes>
    </div>
  );
}
export default App;