import React from "react";
import "../css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ForgotPwd from "./forgot_pwd";
import Page404 from "./PageNotFound";
import ProtectedRoute from "../Components/ProttectedRoute";
import LandingPage from "./LandingPage";
import Dashboard from "./DashBoard";

function App() {

  return (
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
  );
}

export default App;
