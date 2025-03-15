import * as React from "react";
import { Box } from "@mui/material";
import Channels from "../Components/Channels"; // Importing Channels.tsx

function Dashboard() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="flex-start" 
      minHeight="100vh" 
      bgcolor="#2A2A2A" 
      pt={4} // Moves content slightly down from the top
    >
      <Box width="90%"> {/* Controls width for a better layout */}
        <Channels /> {/* Rendering Channels component */}
      </Box>
    </Box>
  );
}

export default Dashboard;
