import "../css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Login from "./Login";
import Page404 from "./PageNotFound";
import ProtectedRoute from "../Components/ProtectedRoute";
import LandingPage from "./LandingPage";
import Dashboard from "./DashBoard";
import Layout from "../Components/Layout";
import AboutUser from "./AboutUser";
import ViewProject from "../Components/ViewProject";
import { useUser } from "../hooks/UserContext";
import Error500Page from "./Error500Page";
import Activity from "../pages/Activity";
import CalendarPage from "../pages/Calendar";
import ViewOrg from "./ViewOrganization";
import CreateNewIssue from "../Components/CreateIssue/CreateIssue";
import { defaultBoard } from "../Components/CreateIssue/CreateIssue";
import React from "react";
import EmailVerification from "./EmailVerification";
import CreateOrganization from "../Components/CreateOrganization/CreateOrganization";
import CreateProject from "../Components/CreateProject";
import Faq from "./Faq";

function App() {
  const [theme, colorMode] = useMode();

  let sessionId = localStorage.getItem("sessionid");
  const [loggedIn] = React.useState<string | null>(sessionId);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            {/* set up Routes */}
            <Routes>
              {!(loggedIn === null || loggedIn === undefined) ? (
                <Route element={<Layout />}>
                  <Route path="/viewProject" element={<ViewProject />} />
                </Route>
              ) : (
                <Route path="/" element={<LandingPage />} />
              )}

              {/* route for login and signup */}
              <Route path="/login" element={<Login />} />
              <Route path="/testt" element={<LandingPage />} />
              <Route path="/testt" element={<LandingPage />} />
              <Route path="/verification" element={<EmailVerification />} />

              {/* route for email verification */}

              {/* user related routes */}
              <Route path="/user/:userId">
                <Route element={<Layout />}>
                  <Route path="aboutUser" element={<AboutUser />} />
                  <Route path="organizations" />
                  <Route path="projects" />
                  <Route path="issues" />
                </Route>
              </Route>

              {/* project related routes */}
              <Route element={<Layout />}>
                {/* /project/:projectId */}
                <Route path="project">
                  <Route path=":projectName" element={<ViewProject />}>
                    {/* /project/:projectId/users */}
                    <Route path="users" element={<Layout />} />
                    {/* /project/:projectId/issues */}
                    <Route path="issues" element={<Layout />} />
                  </Route>
                </Route>
              </Route>

              {/* organization related routes */}
              <Route path="/organization">
                <Route path=":orgId">
                  <Route path="users" />
                  <Route path="projects" />
                  <Route path="issues" />
                </Route>
              </Route>

              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/viewProject" element={<ViewProject />} />
                <Route path="/about_user" element={<AboutUser />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/vieworg" element={<ViewOrg />} />
                <Route
                  path="/createIssue"
                  element={<CreateNewIssue board={defaultBoard} />}
                />
                <Route path="/viewOrg" element={<ViewOrg />} />
                <Route path="createOrg" element={<CreateOrganization />} />
                <Route path="createProject" element={<CreateProject />} />
                <Route path="/Faq" element={<Faq />} />
              </Route>

              {/* routes for 404 and server errors */}
              <Route element={<Layout />}>
                <Route path="*" element={<Page404 />} />
              </Route>
              <Route path="/500" element={<Error500Page />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
