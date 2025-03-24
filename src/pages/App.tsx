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
import Layout from "../Components/Layout";
import AboutUser from "./AboutUser";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_pwd" element={<ForgotPwd />} />

              {/* Dev version nested dynamic routes */}
              <Route path="/:userId" element={<ForgotPwd />}>
                <Route path="organizations/:orgId" />
                <Route path="projects/:projectId" />
              </Route>
              <Route path="/:projectId">
                <Route path="users/:userId" />
              </Route>
              <Route path="/:orgId">
                <Route path="users/:userId" />
                <Route path="projects/:projectId" />
              </Route>

              {/* Protected Routes wrapped in layout */}
              <Route element={<Layout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about_user"
                  element={
                    <ProtectedRoute>
                      <AboutUser />
                    </ProtectedRoute>
                  }
                />
                <Route path="/testd" element={<Dashboard />} />
                <Route path="/testau" element={<AboutUser />} />
              </Route>

              {/* Catch-all for 404s */}
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
