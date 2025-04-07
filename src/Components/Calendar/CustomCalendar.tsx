import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";
import { Calendar, dateFnsLocalizer, View, NavigateAction } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/CalendarStyles.css";

// Import missing components from Material UI
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

// Localizer setup for the calendar using date-fns
const locales = {};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Sample events for the calendar
const events = [
  { title: "DevOps: Deploy API", start: new Date("2025-04-21T10:00"), end: new Date("2025-04-21T11:00"), channel: "devops" },
  { title: "Frontend: Update UI", start: new Date("2025-04-25T14:00"), end: new Date("2025-04-25T15:00"), channel: "frontend" },
  { title: "Backend: Fix Auth", start: new Date("2025-04-18T09:00"), end: new Date("2025-04-18T10:00"), channel: "backend" },
  { title: "Design: Create Wireframe", start: new Date("2025-04-22T13:00"), end: new Date("2025-04-22T14:00"), channel: "design" },
];

function CustomCalendar() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Settings for the calendar (color scheme and thresholds for task types)
  const [settings, setSettings] = useState({
    urgentThreshold: 1,  // Days threshold for urgent tasks
    upcomingThreshold: 3, // Days threshold for upcoming tasks
    urgentColor: "#f28b82", // Urgent color
    upcomingColor: "#fff475", // Upcoming color
    defaultColor: "#ccff90", // Default task color
  });

  useEffect(() => {
    // Load settings from localStorage if available
    const storedSettings = localStorage.getItem("calendarSettings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Handler to update settings (e.g., task color thresholds)
  const handleSettingChange = (field: string, value: string | number) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [field]: value };
      // Save settings to localStorage (comment out when moving to backend)
      localStorage.setItem("calendarSettings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Function to determine the style of the event based on urgency
  const eventStyleGetter = (event: any) => {
    const now = new Date();
    const diff = differenceInDays(event.start, now);

    // Determine background color based on thresholds and task urgency
    if (diff < settings.urgentThreshold) {
      return { style: { backgroundColor: settings.urgentColor, color: "#000" } };
    }
    if (diff < settings.upcomingThreshold) {
      return { style: { backgroundColor: settings.upcomingColor, color: "#000" } };
    }
    return { style: { backgroundColor: settings.defaultColor, color: "#000" } };
  };

  // Function to handle navigation between different calendar views
  const handleNavigate = (currentDate: Date, currentView: View, action: NavigateAction) => {
    // This function helps to navigate to the previous/next date based on the action (PREV/NEXT)
    const newDate = new Date(currentDate);
    if (action === "PREV") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (action === "NEXT") {
      newDate.setDate(newDate.getDate() + 1);
    }
    setDate(newDate);
  };

  return (
    <Box width="100%" p={3} bgcolor="#1e1e1e" minHeight="100vh" borderRadius={2}>
      <Typography variant="h5" sx={{ color: "#fff", mb: 2, textAlign: "center" }}>
        Calendar
      </Typography>

      {/* Toolbar with Calendar Controls (Today, Prev, Next buttons, and View Selector) */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setDate(new Date())} sx={{ color: "#fff", borderColor: "#555" }}>
            Today
          </Button>
          <Button variant="outlined" onClick={() => handleNavigate(date, view, "PREV")} sx={{ color: "#fff", borderColor: "#555" }}>
            Prev
          </Button>
          <Button variant="outlined" onClick={() => handleNavigate(date, view, "NEXT")} sx={{ color: "#fff", borderColor: "#555" }}>
            Next
          </Button>
        </Stack>

        {/* Toggle Buttons for Day, Week, Month Views */}
        <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
          <ToggleButton value="day" sx={{ color: "#fff", borderColor: "#555" }}>Day</ToggleButton>
          <ToggleButton value="week" sx={{ color: "#fff", borderColor: "#555" }}>Week</ToggleButton>
          <ToggleButton value="month" sx={{ color: "#fff", borderColor: "#555" }}>Month</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Calendar Display */}
      <Box sx={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          onSelectEvent={(event) => navigate(`/channels/${event.channel}`)}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          style={{ height: "100%", backgroundColor: "#1e1e1e", color: "#fff" }}
        />
      </Box>

      {/* Color Customization Options Below the Calendar */}
      <Box sx={{ mt: 2, textAlign: "center", color: "#fff" }}>
        <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
          Customize Task Color Scheme
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Stack spacing={1}>
            <Typography sx={{ color: "#fff" }}>Urgent if &lt;</Typography>
            <TextField
              type="number"
              value={settings.urgentThreshold}
              onChange={(e) => handleSettingChange("urgentThreshold", parseInt(e.target.value))}
              sx={{ width: 80 }}
              variant="outlined"
              size="small"
              InputProps={{ sx: { color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#fff" } }}
            />
            <Typography sx={{ color: "#fff" }}>days</Typography>
            <input
              type="color"
              value={settings.urgentColor}
              onChange={(e) => handleSettingChange("urgentColor", e.target.value)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography sx={{ color: "#fff" }}>Upcoming if &lt;</Typography>
            <TextField
              type="number"
              value={settings.upcomingThreshold}
              onChange={(e) => handleSettingChange("upcomingThreshold", parseInt(e.target.value))}
              sx={{ width: 80 }}
              variant="outlined"
              size="small"
              InputProps={{ sx: { color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#fff" } }}
            />
            <Typography sx={{ color: "#fff" }}>days</Typography>
            <input
              type="color"
              value={settings.upcomingColor}
              onChange={(e) => handleSettingChange("upcomingColor", e.target.value)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography sx={{ color: "#fff" }}>Default Color</Typography>
            <input
              type="color"
              value={settings.defaultColor}
              onChange={(e) => handleSettingChange("defaultColor", e.target.value)}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default CustomCalendar;
