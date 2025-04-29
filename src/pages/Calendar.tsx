import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomCalendar from '../Components/Calendar/CustomCalendar';
// Removed unused import: import Layout from '../Components/Sidebar';
// Removed Sidebar import - Assuming Layout component provides the necessary structure
// import { Sidebar } from 'react-pro-sidebar';

/**
 * Renders the main Calendar page for the application.
 *
 * This component serves as a container page that displays the calendar view.
 * It assumes a layout (like Sidebar + Main Content) is provided by a parent component (e.g., Layout.tsx).
 * It renders the `CustomCalendar` component which handles the actual calendar
 * display and logic.
 *
 * @component
 * @example
 * // Usage in App.tsx routes (inside Layout):
 * <Route path="/calendar" element={<CalendarPage />} />
 *
 * @returns {JSX.Element} The CalendarPage component.
 */
const CalendarPage = () => {
  return (
    // Removed the <Sidebar> wrapper. Assuming Layout component handles the sidebar.
    // Added flex properties to help the inner Box expand if needed.
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Container for the CustomCalendar component */}
      {/* Removed mt: 30. Using mt: 2. */}
      {/* Changed height strategy: Use flexGrow to fill remaining space */}
      <Box sx={{
          width: '100%',
          flexGrow: 1, // Allow this Box to take up remaining vertical space
          mt: 2,      // Use a standard margin-top
          overflow: 'hidden', // Keep overflow hidden on the container
        }}>
        {/* CustomCalendar should fill this container */}
        <CustomCalendar />
      </Box>
    </Box>
  );
};

export default CalendarPage;
