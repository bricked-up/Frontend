import * as React from "react";
import { Box } from "@mui/material";
import Channels from "../Components/Channels";
import Calendar from "../Components/Calendar";

/**
 * The dashboard component
 *
 * This is the component for the main dashboard page of our app. The two sections
 * displayed are:
 * - `Channels` component -> displays different channels for each task of each team.
 * - `Calendar` component -> for scheduling tasks (TO DO: color code each task, nice theme).
 *
 * NB: This might change in the future, thinking about showing each project (aka team) as
 * a gallery upon opening dashboard.
 *
 * @component
 * @example
 * // Usage in a route (in App.tsx)
 * <Route path="/dashboard" element={<Dashboard />} />
 *
 * @returns {JSX.Element} The Dashboard component.
 */
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
