import React from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { useTheme } from "@mui/material/styles";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ForgotPwd from "./forgot_pwd";
import Page404 from "./PageNotFound";
import AboutUser from "./AboutUser";
import Form from "./User";

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
          <Route path="/about_user" element={<AboutUser />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
