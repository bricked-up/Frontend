import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LogoutButton from "./Navbar/LogoutButton"; // Keeping this import as it was in the provided code
import "../css/dashboard.css";

/**
 * Provides the main structural layout for authenticated sections of the application.
 *
 * This component renders a persistent sidebar (`Sidebar`), a top navigation bar (`Topbar`),
 * and a main content area where nested routes are rendered via the `<Outlet />` component
 * from `react-router-dom`. It manages the collapsed/expanded state of the sidebar
 * and adjusts the left margin of the main content area accordingly with a transition effect.
 *
 * @component
 * @example
 * // Used in App.tsx to wrap protected routes
 * <Route element={<Layout />}>
 * <Route path="/dashboard" element={<Dashboard />} />
 * <Route path="/activity" element={<Activity />} />
 * // ... other routes
 * </Route>
 *
 * @returns {JSX.Element} The Layout component providing the app's structure.
 */
const Layout: React.FC = () => {
  const [isSidebar, setIsSidebar] = useState<boolean>(true);
  const theme = useTheme();

  useEffect(() => {
    const main = document.getElementById("main");
    if (main) {
      main.style.transition = "margin-left 0.5s ease";
      main.style.marginLeft = isSidebar ? "250px" : "0";
    }
  }, [isSidebar]);

  return (
    <Box
      className="dashboard"
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Sidebar */}
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

      {/* Main Content */}
      <Box
        id="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Topbar */}
        <Box
          sx={{
            width: "100%",
            height: "64px",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Topbar setIsSidebar={setIsSidebar} setIsCollapsed={setIsSidebar} />
        </Box>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, padding: "20px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
