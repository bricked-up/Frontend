import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../css/App.css";
import { useTheme } from "@mui/material/styles";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import Login from "./Login";
import HomePage from "./HomePage/HomePage";
import ForgotPwd from "./forgot_pwd";
import Page404 from "./PageNotFound";
import ProtectedRoute from "../Components/ProttectedRoute";


function App() {
  const theme = useTheme();

  return (
    <Router>
      <div className="App">
        <ThemeToggleButton toggleTheme={() => { /* Add your toggle theme logic here */ }} />
        {/* Set up Routes */}
        <Routes>
          {/*route for login and signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_pwd" element={<ForgotPwd />} />
          <Route path="/dashboard" element={<HomePage />} />
	  <Route path="*" element={<Page404 />} />
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute defaultRoute="/login" ><Page404 /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
