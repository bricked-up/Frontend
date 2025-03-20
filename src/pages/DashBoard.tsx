import * as React from "react";
import { Box } from "@mui/material";
import Channels from "../Components/Channels";
import Calendar from "../Components/Calendar";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";

function Dashboard() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor="#2A2A2A"
    >
      {/* Topbar */}
      <Box pt={20}>
        <Topbar />
      </Box>

      <Box display="flex" flex="1">
        {/* Sidebar */}
        <Box
          flex="0 0 250px"
          sx={{
            height: "100vh",
            zIndex: 100,
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          flex="1"
          pt={8}
          width="100%"
        >
          <Box width="90%">
            <Channels />
          </Box>
          <Box width="80%" mt={-10} display="flex" justifyContent="center">
            <Calendar />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
