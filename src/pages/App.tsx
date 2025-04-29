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
import ViewTeams from "../Components/ViewProject";
import { useUser } from "../hooks/UserContext";
import Error500Page from "./Error500Page";
import EditProjectForm from "../Components/EditProjectForm";

function App() {
  const [theme, colorMode] = useMode();
  const { user } = useUser();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Routes>
              {user ? (
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
              ) : (
                <Route path="/" element={<LandingPage />} />
              )}

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_pwd" element={<ForgotPwd />} />

              {/* User */}
              <Route path="/user">
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
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/view_team" element={<ViewTeams />} />
                <Route path="/about_user" element={<AboutUser />} />
                {/* ✅ TEMP ROUTE FOR EDIT PROJECT FORM */}
                <Route path="/projects/:projectId/edit" element={<EditProjectForm />} />
              </Route>

              {/* Errors */}
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
