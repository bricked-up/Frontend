import React from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { useTheme } from "@mui/material/styles";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Login from "./Login";
import ForgotPwd from "./forgot_pwd";
import Page404 from "./PageNotFound";
import ProtectedRoute from "../Components/ProttectedRoute";
import LandingPage from "./LandingPage";
import Dashboard from "./DashBoard";
//import AboutUser from "./AboutUser";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      {" "}
      {/* Wrap the app with ColorModeContext.Provider */}
      <ThemeProvider theme={theme}>
        {" "}
        {/* Pass the theme to ThemeProvider */}
        <CssBaseline /> {/* Ensure baseline styles are applied */}
        <Router>
          <div className="App">
            {/*set up Routes */}
            <Routes>
              {/*route for login and signup */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_pwd" element={<ForgotPwd />} />
              <Route path="*" element={<Page404 />} />
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/*<Route path="/about_user" element={<AboutUser />} />*/}
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
