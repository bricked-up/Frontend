import React from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { useTheme } from "@mui/material/styles";
import ThemeToggleButton from "./ThemeToggleButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import forgotpwd from "../pages/forgot_pwd";
import ForgotPwd from "../pages/forgot_pwd";

function App() {
  const theme = useTheme();

  return (
    <Router>
      <div className="App">
        {/*set up Routes */}
        <Routes>
          {/*route for login and signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_pwd" element={<ForgotPwd />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
