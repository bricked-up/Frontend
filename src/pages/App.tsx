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
import ViewTeams from "../Components/ViewTeam";
import LoadingPage from "./LoadingPage";

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
              <Route path="/user" >
                {/* all of these routes are subroutes of :userId*/}
                <Route path="/:userId">
                  <Route index path="about" element={<ProtectedRoute><AboutUser /></ProtectedRoute>} />
                  <Route element={<Layout />}>
                    <Route path="organizations/:orgId" />
                    <Route path="projects/:projectId" />
                  </Route>
                </Route>
              </Route>

              {/* project related routes */}
              <Route path="/project">
                <Route path="/:projectId">
                  <Route path="users" />
                </Route>
              </Route>

              {/* organization related routes */}
              <Route path="/organization">
                <Route path="/:orgId">
                  <Route path="users" />
                  <Route path="projects" />
                </Route>
              </Route>

              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="/view_team" element={<ViewTeams />} />
                <Route path="/about_user" element={<AboutUser />} />

                <Route path="/test" element={<Dashboard />}></Route>
              </Route>
              <Route path="/test1" element={<LoadingPage />}></Route>

              {/* routes for 404 and server errors */}
              <Route path="*" element={<Page404 />} />
              <Route path="/505" element={<Page404 />} />

            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
