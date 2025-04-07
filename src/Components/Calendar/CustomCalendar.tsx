import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Calendar, dateFnsLocalizer, View, NavigateAction } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/CalendarStyles.css";

// Setup localization
const locales = {};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Sample calendar events
const events = [
  { title: "DevOps: Deploy API", start: new Date("2025-04-21T10:00"), end: new Date("2025-04-21T11:00"), channel: "devops" },
  { title: "Frontend: Update UI", start: new Date("2025-04-25T14:00"), end: new Date("2025-04-25T15:00"), channel: "frontend" },
  { title: "Backend: Fix Auth", start: new Date("2025-04-18T09:00"), end: new Date("2025-04-18T10:00"), channel: "backend" },
  { title: "Design: Create Wireframe", start: new Date("2025-04-22T13:00"), end: new Date("2025-04-22T14:00"), channel: "design" },
];

// Type-safe keys
type ThresholdKey = "urgentThreshold" | "upcomingThreshold";
type ColorKey = "urgentColor" | "upcomingColor" | "defaultColor";

const CustomCalendar = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const [settings, setSettings] = useState<{
    urgentThreshold: number;
    upcomingThreshold: number;
    urgentColor: string;
    upcomingColor: string;
    defaultColor: string;
  }>({
    urgentThreshold: 1,
    upcomingThreshold: 3,
    urgentColor: "#f28b82",
    upcomingColor: "#fff475",
    defaultColor: "#ccff90",
  });

  useEffect(() => {
    const stored = localStorage.getItem("calendarSettings");
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const handleSettingChange = (field: ThresholdKey | ColorKey, value: number | string) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    localStorage.setItem("calendarSettings", JSON.stringify(updated));
  };

  const eventStyleGetter = (event: any) => {
    const now = new Date();
    const diff = differenceInDays(event.start, now);

    if (diff < settings.urgentThreshold) {
      return { style: { backgroundColor: settings.urgentColor, color: "#000" } };
    } else if (diff < settings.upcomingThreshold) {
      return { style: { backgroundColor: settings.upcomingColor, color: "#000" } };
    }
    return { style: { backgroundColor: settings.defaultColor, color: "#000" } };
  };

  const handleNavigate = (currentDate: Date, _: View, action: NavigateAction) => {
    const newDate = new Date(currentDate);
    if (action === "PREV") newDate.setDate(newDate.getDate() - 1);
    else if (action === "NEXT") newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const settingConfig: {
    label: string;
    threshold?: ThresholdKey;
    color: ColorKey;
  }[] = [
    { label: "Urgent if <", threshold: "urgentThreshold", color: "urgentColor" },
    { label: "Upcoming if <", threshold: "upcomingThreshold", color: "upcomingColor" },
    { label: "Default Color", color: "defaultColor" },
  ];

  return (
    <Box sx={{ paddingTop: "64px", maxHeight: "calc(100vh - 64px)", overflowY: "auto", bgcolor: "#1e1e1e", px: 3 }}>
      <Typography variant="h5" sx={{ color: "#fff", mb: 2, textAlign: "center" }}>
        Calendar
      </Typography>

      {/* Controls */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
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
        <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
          <ToggleButton value="day" sx={{ color: "#fff", borderColor: "#555" }}>Day</ToggleButton>
          <ToggleButton value="week" sx={{ color: "#fff", borderColor: "#555" }}>Week</ToggleButton>
          <ToggleButton value="month" sx={{ color: "#fff", borderColor: "#555" }}>Month</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Calendar */}
      <Box sx={{ height: "70vh", mb: 3 }}>
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

      {/* Color Customization */}
      <Box sx={{ color: "#fff", mt: 3 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          Customize Task Color Scheme
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          {settingConfig.map(({ label, threshold, color }) => (
            <Stack key={label} spacing={1} alignItems="center">
              <Typography>{label}</Typography>
              {threshold && (
                <>
                  <TextField
                    type="number"
                    value={settings[threshold]}
                    onChange={(e) => handleSettingChange(threshold, parseInt(e.target.value))}
                    sx={{ width: 80 }}
                    variant="outlined"
                    size="small"
                    InputProps={{ sx: { color: "#fff" } }}
                    inputProps={{ style: { textAlign: "center" } }}
                  />
                  <Typography sx={{ fontSize: 12, color: "#aaa" }}>days</Typography>
                </>
              )}
              <input
                type="color"
                value={settings[color]}
                onChange={(e) => handleSettingChange(color, e.target.value)}
                style={{ width: 40, height: 30, border: "none", background: "transparent" }}
              />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CustomCalendar;
