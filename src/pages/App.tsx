import "../css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Login from "./Login";
import ForgotPwd from "./forgot_pwd";
import Page404 from "./PageNotFound";
import ProtectedRoute from "../Components/ProtectedRoute";
import LandingPage from "./LandingPage";
import Dashboard from "./DashBoard";
import Layout from "../Components/Layout";
import AboutUser from "./AboutUser";
import ViewProject from "../Components/ViewProject";
import { useUser } from "../hooks/UserContext";
import Error500Page from "./Error500Page";
import CustomCalendar from "../Components/Calendar/CustomCalendar";
import CreateIssue from "../Components/CreateIssue/CreateIssue";
import { mockBoard } from "../Components/CreateIssue/CreateIssue";
import Activity from "./Activity";

function App() {
  const [theme, colorMode] = useMode();
  const { user } = useUser();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            {/*set up Routes */}
            <Routes>
              {user ? (
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
              ) : (
                <Route path="/" element={<LandingPage />} />
              )}

              {/*route for login and signup */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_pwd" element={<ForgotPwd />} />

              {/* TO DELETE: Test routes cause I can't login / sign up :3 */}
              <Route path="/" element={<LandingPage />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about_user" element={<AboutUser />} />
                <Route path="/viewproject" element={<ViewProject />} />
                <Route path="/calendar" element={<CustomCalendar />} />
                <Route
                  path="/createissue"
                  element={<CreateIssue board={mockBoard} />}
                />
              </Route>

              {/* user related routes */}
              <Route path="/user">
                {/* all of these routes are subroutes of :userId*/}
                <Route path=":userId">
                  <Route
                    index
                    path="about"
                    element={
                      <ProtectedRoute>
                        <AboutUser />
                      </ProtectedRoute>
                    }
                  />
                  <Route element={<Layout />}>
                    <Route path="organizations" />
                    <Route path="projects" />
                    <Route path="issues" />
                  </Route>
                </Route>
              </Route>

              {/* project related routes */}
              <Route path="/project">
                <Route path=":projectId">
                  <Route path="users" />
                  <Route path="issues" />
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
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="/view_project" element={<ViewProject />} />
                <Route path="/about_user" element={<AboutUser />} />
                <Route path="/activity" element={<Activity />} />
              </Route>

              {/* routes for 404 and server errors */}
              <Route path="*" element={<Page404 />} />
              <Route path="/500" element={<Error500Page />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
