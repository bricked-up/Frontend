import React from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { useTheme } from "@mui/material/styles";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import forgotpwd from "./forgot_pwd";
import ForgotPwd from "./forgot_pwd";
import Page404 from "./PageNotFound";

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
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
