import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material"; // Import useTheme
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/dashboard.css";

const Layout: React.FC = () => {
  const [isSidebar, setIsSidebar] = useState<boolean>(true);
  const theme = useTheme(); // Get the theme object

  // This useEffect correctly handles the main content margin based on sidebar state
  useEffect(() => {
    const main = document.getElementById("main");
    if (main) {
      // Ensure smooth transition for margin adjustment
      main.style.transition = "margin-left 0.3s ease"; // Match sidebar transition
      main.style.marginLeft = isSidebar ? "250px" : "0";
    }
  }, [isSidebar]);

  return (
    // Use theme background for the overall container if needed, or keep default
    <Box className="viewProject" sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

      {/* Main Content Wrapper */}
      <Box
        id="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          // Apply transition for margin changes
          transition: "margin-left 0.3s ease", // Match sidebar transition
          // Set the background for the entire main content area
          backgroundColor: theme.palette.background.default, // Use theme default background
        }}
      >
        {/* Topbar */}
        <Box
          sx={{
            width: "100%", // Takes full width of the main content area
            height: "64px", // Standard topbar height
            position: "sticky", // Make topbar sticky
            top: 0,
            zIndex: 1150, // Ensure Topbar is above content but below Sidebar toggle
             // Add background to Topbar container if Topbar itself doesn't have one
             // backgroundColor: theme.palette.background.paper, // Example
             // borderBottom: `1px solid ${theme.palette.divider}`, // Example
          }}
        >
          {/* Pass isSidebar state to Topbar if it needs it (e.g., for hamburger icon) */}
          <Topbar setIsSidebar={setIsSidebar} setIsCollapsed={setIsSidebar} />
          {/* Removed redundant setIsCollapsed prop if it just mirrors setIsSidebar */}
        </Box>

        {/* Page Content Area */}
        {/* This Box now holds the Outlet. It will grow and handle scrolling */}
        <Box
            component="main" // Use main semantic tag
            sx={{
                flexGrow: 1, // Allow this area to grow and fill space
                padding: { xs: 1, sm: 2, md: 3 }, // Responsive padding around content
                overflowY: 'auto', // Allow vertical scrolling for the content area itself
                // The background is now set on the parent Box (id="main")
            }}
        >
          <Outlet /> {/* Renders the matched route component (e.g., Activity) */}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;