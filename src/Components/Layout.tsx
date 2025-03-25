/**
 * The layout component
 *
 * This component serves as the main layout wrapper for our app.
 * It includes:
 * - A `Sidebar` for navigation.
 * - A `Topbar` for theme toggle, settings and notifications (looking into 'Activity'
 * option in the sidebar instead!!).
 * - A dynamic content area (`Outlet`) where child routes are rendered.
 *
 *
 * @component
 * @example
 * // Usage in App.tsx or routing configuration
 * <Route path="/" element={<Layout />}>
 *   <Route path="dashboard" element={<Dashboard />} />
 * </Route>
 *
 * @returns {JSX.Element} The Layout component.
 */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/dashboard.css";

const Layout: React.FC = () => {
  const [isSidebar, setIsSidebar] = useState<boolean>(true);

  return (
    <Box className="dashboard" sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
