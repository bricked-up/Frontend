import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomCalendar from '../Components/Calendar/CustomCalendar'; 
import Layout from '../Components/Sidebar'; 
import { Sidebar } from 'react-pro-sidebar';

const CalendarPage = () => {
  return (
    <Sidebar> {/* This ensures the sidebar and navbar are still visible */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Calendar Page
        </Typography>
        
        {/* CustomCalendar component to control its size, position, etc. */}
        <Box sx={{ width: '100%', height: '80vh', overflow: 'hidden', mt: 30 }}>
          <CustomCalendar />
        </Box>
      </Box>
    </Sidebar>
  );
};

export default CalendarPage;
