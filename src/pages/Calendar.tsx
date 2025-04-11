import React from 'react';
import { Box, Typography, useTheme } from '@mui/material'; // Added useTheme
import CustomCalendar from '../Components/Calendar/CustomCalendar'; // Verify this path is correct

// REMOVE these incorrect imports:
// import Layout from '../Components/Sidebar'; // Incorrect
// import { Sidebar } from 'react-pro-sidebar'; // Incorrect

// This component should render *only* the content for the calendar page area,
// assuming it's rendered within the <Outlet /> of your main Layout.tsx
const CalendarPage = () => {
  const theme = useTheme(); // Get the theme for consistent styling if needed

  return (
    // Use a Box that fills the available space provided by Layout's Outlet
    // The Layout component should ideally handle padding for the content area.
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // Let the content fill the height provided by the parent (Layout's content Box)
        height: '100%', // Ensures this Box tries to fill its container
        // Remove any fixed height like 80vh or large margins like mt: 30
      }}
    >
      {/* Optional: Add a title for the page */}
      <Typography
        variant="h4" // Or choose appropriate variant
        sx={{
           mb: theme.spacing(3), // Add some margin below the title
           color: theme.palette.text.primary, // Use theme text color
           fontWeight: 600, // Example weight
        }}
      >
        Calendar
      </Typography>

      {/* Let CustomCalendar take the remaining space */}
      {/* The CustomCalendar component itself has height: '100%' internally */}
      {/* The parent Box above needs height: '100%' or flexGrow:1 for this to work */}
      <Box sx={{ flexGrow: 1, height: '100%' }}> {/* Added wrapper to ensure height */}
        <CustomCalendar />
      </Box>

    </Box>
  );
};

export default CalendarPage;