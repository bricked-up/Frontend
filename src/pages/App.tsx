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
        {/*set up Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/*route for login and signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_pwd" element={<ForgotPwd />} />
          {/* user related routes */}
          <Route path="/:userId" element={<ForgotPwd />}>
            {/* all of these routes are subroutes of :userId*/}
            <Route path="organizations/:orgId" />
            <Route path="projects/:projectId" />
          </Route>
          {/* project related routes */}
          <Route path="/:projectId">
            <Route path="users/:userId" />
          </Route>
          {/* organization related routes */}
          <Route path="/:orgId">
            <Route path="users/:userId" />
            <Route path="projects/:projectId" />
          </Route>
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* routes for 404 and server errors */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </Router>
         </ThemeProvider>
    </ColorModeContext.Provider>

  );
}

export default App;
