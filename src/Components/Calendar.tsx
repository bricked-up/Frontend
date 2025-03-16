import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Localizer without locale
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: {} // No locale imported here
});

// Sample tasks with due dates
const events = [
  { title: "DevOps: Deploy API", start: new Date("2025-03-21"), end: new Date("2025-03-21"), channel: "devops" },
  { title: "Frontend: Update UI", start: new Date("2025-03-25"), end: new Date("2025-03-25"), channel: "frontend" },
  { title: "Backend: Fix Auth", start: new Date("2025-03-18"), end: new Date("2025-03-18"), channel: "backend" },
  { title: "Design: Create Wireframe", start: new Date("2025-03-22"), end: new Date("2025-03-22"), channel: "design" },
];

function CustomCalendar() {
  const navigate = useNavigate();

  return (
    <Box width="90%" bgcolor="#1E1E1E" padding={2} borderRadius={2} mt={4}>
      <Typography variant="h6" sx={{ color: "#fff", textAlign: "center", paddingBottom: 2 }}>
        Calendar
      </Typography>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, color: "#fff" }}
        onSelectEvent={(event) => navigate(`/channels/${event.channel}`)}

        // Allow view switching: day, week, month
        views={['month', 'week', 'day']}
        defaultView="month" // Start with the month view

        // Fix for showing only days of the current month
        dayPropGetter={(date) => {
          const today = new Date();
          if (date.getMonth() !== today.getMonth()) {
            return {
              style: {
                visibility: 'hidden', // Hide days that are not part of the current month
              },
            };
          }
          return {};
        }}
      />
    </Box>
  );
}

export default CustomCalendar;
