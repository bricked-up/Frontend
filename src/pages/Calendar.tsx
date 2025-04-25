import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomCalendar from '../Components/Calendar/CustomCalendar';
// Removed unused import: import Layout from '../Components/Sidebar';
import { Sidebar } from 'react-pro-sidebar'; // Assuming this is the intended Sidebar wrapper

/**
 * Renders the main Calendar page for the application.
 *
 * This component serves as a container page that displays the calendar view.
 * It uses the `Sidebar` component from `react-pro-sidebar` for consistent layout
 * and renders the `CustomCalendar` component which handles the actual calendar
 * display and logic.
 *
 * @component
 * @example
 * // Usage in App.tsx routes:
 * <Route path="/calendar" element={<CalendarPage />} />
 *
 * @returns {JSX.Element} The CalendarPage component.
 */
const CalendarPage = () => {
  return (
    // Using Sidebar from react-pro-sidebar as the wrapper
    <Sidebar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Calendar Page
        </Typography>

        {/* Container for the CustomCalendar component */}
        {/* Adjust height/margin as needed for layout */}
        <Box sx={{ width: '100%', height: '80vh', overflow: 'hidden', mt: { xs: 1, sm: 2 } /* Reduced top margin a bit */ }}>
          <CustomCalendar />
        </Box>
      </Box>
    </Sidebar>
  );
};

export default CalendarPage;