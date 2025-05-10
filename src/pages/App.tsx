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
import EditProjectForm from "../Components/EditProjectForm";
import Activity from "../pages/Activity";
import CalendarPage from "../pages/Calendar";
import ViewOrg from "./ViewOrganization";
import CreateTask from "../Components/CreateIssue/CreateIssue";
import { mockBoard } from "../Components/CreateIssue/CreateIssue";

function App() {
  const [theme, colorMode] = useMode();
  const { user } = useUser();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            {/* set up Routes */}
            <Routes>
              {user ? (
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
              ) : (
                <Route path="/" element={<LandingPage />} />
              )}

              {/* route for login and signup */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_pwd" element={<ForgotPwd />} />
              <Route path="/testt" element={<LandingPage />} />

              {/* user related routes */}
              <Route path="/user/:userId">
                <Route element={<Layout />}>
                  <Route path="aboutUser" element={<AboutUser />} />
                  <Route path="organizations" />
                  <Route path="projects" />
                  <Route path="issues" />
                </Route>
              </Route>



              {/* Project */}
              <Route path="/project">
                <Route path=":projectId">
                  <Route path="users" />
                  <Route path="issues" />
                </Route>
              </Route>

              {/* Organization */}
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
                    <Dashboard />
                  }
                />
                <Route path="/viewProject" element={<ViewProject />} />
                <Route path="/aboutUser" element={<AboutUser />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/viewOrg" element={<ViewOrg />} />
                <Route path="/createIssue" element={<CreateTask board={mockBoard} />} />
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
