import * as React from "react";
import { Box, useTheme } from "@mui/material";
import ViewProject from "../Components/ViewProject";

/**
 * The dashboard component
 *
 * This is the component for the main dashboard page of our app. The two sections
 * displayed are:
 * - `Channels` component -> displays different channels for each task of each team.
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
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      alignItems="center"
      paddingTop={"650px"}
      width="100%"
      sx={{
        backgroundColor: theme.palette.background.default, // <-- fix is here
      }}
    >
      <Box width="100%" mt={-80}>
        <ViewProject />
      </Box>
    </Box>
  );
}

export default Dashboard;
