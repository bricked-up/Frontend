import * as React from "react";
import { Box } from "@mui/material";
import Channels from "../Components/Channels";
import Calendar from "../Components//Calendar";

function Dashboard() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" bgcolor="#2A2A2A" pt={80}>
      <Box width="90%">
        <Channels />
      </Box>
      <Box width="80%" mt={-10} display="flex" justifyContent="center"> {/* Centering Calendar */}
        <Calendar />
      </Box>
    </Box>
  );
}

export default Dashboard;
