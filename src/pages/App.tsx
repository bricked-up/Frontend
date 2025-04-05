import React from "react";
import "../css/App.css";
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
<<<<<<< HEAD
import LoadingPage from "./LoadingPage";
=======
import ViewTeams from "../Components/ViewTeam";
>>>>>>> dev

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
              <Route path="/:userId" element={<ProtectedRoute><AboutUser /></ProtectedRoute>}>
                {/* all of these routes are subroutes of :userId*/}
                <Route index path="about" element={<ProtectedRoute><AboutUser /></ProtectedRoute>} />
                <Route element={<Layout />}>
                  <Route path="organizations/:orgId" />
                  <Route path="projects/:projectId" />
                </Route>
              </Route>

              {/* project related routes */}
              <Route path="/:projectId">
                <Route path="users/:userId" />
              </Route>

              {/* organization related routes */}
              <Route path="/:orgId">
                <Route path="users" />
                <Route path="users/:userId" />
                <Route path="projects/:projectId" />
              </Route>

              {/* Protected Routes */}
              <Route element={<Layout />}>
<<<<<<< HEAD
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
=======
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/viewteam" element={<ViewTeams />} />
                <Route path="/about_user" element={<AboutUser />} />

                <Route path="/test" element={<Dashboard />}></Route>
>>>>>>> dev
              </Route>
              <Route path="/test" element={<LoadingPage />}></Route>

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
