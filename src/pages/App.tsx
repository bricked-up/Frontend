import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../css/App.css";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import Login from "./Login";
import ForgotPwd from "../pages/forgot_pwd"; // Ensure correct case
import HomePage from "./HomePage/HomePage";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <ThemeToggleButton /> */}
        {/* Set up Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_pwd" element={<ForgotPwd />} />
          <Route path="/dashboard" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
