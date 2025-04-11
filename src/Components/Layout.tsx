import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/dashboard.css";

const Layout: React.FC = () => {
  const [isSidebar, setIsSidebar] = useState<boolean>(true);

  useEffect(() => {
    const main = document.getElementById("main");
    if (main) {
      main.style.transition = "margin-left 0.5s ease";
      main.style.marginLeft = isSidebar ? "250px" : "0";
    }
  }, [isSidebar]);

  return (
    <Box className="dashboard" sx={{ display: "flex", minHeight: "100vh" }}>
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
