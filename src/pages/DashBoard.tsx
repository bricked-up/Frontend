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
      flex="1"
      flexDirection="column"
      alignItems="center"
      paddingTop={"650px"}
      width="100%"
    >
      <Box width="90%">
        <Channels />
      </Box>
      <Box width="80%" mt={-10} display="flex" justifyContent="center">
        <Calendar />
      </Box>
    </Box>
  );
}

export default Dashboard;
