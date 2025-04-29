<<<<<<< HEAD
=======
// SCROLL TO SEE JSDOC
>>>>>>> origin/dev
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
<<<<<<< HEAD
  // Button, // Removed as not directly used
=======
>>>>>>> origin/dev
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Paper,
<<<<<<< HEAD
  // Divider, // Removed as not directly used
=======
>>>>>>> origin/dev
  useTheme,
  useMediaQuery,
  Grid,
  alpha,
} from "@mui/material";
import {
  Calendar,
  dateFnsLocalizer,
  View,
  Views,
  NavigateAction,
  ToolbarProps,
  Navigate,
<<<<<<< HEAD
=======
  EventProps, // Import EventProps for custom event component typing
>>>>>>> origin/dev
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  differenceInDays,
<<<<<<< HEAD
=======
  isSameDay, // Import isSameDay for more accurate threshold checking
>>>>>>> origin/dev
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/CalendarStyles.css"; // Assuming you have custom styles here
import { ArrowBack, ArrowForward, Today, Settings } from "@mui/icons-material";
<<<<<<< HEAD
import { mockActivityData } from '../../utils/mock_Activity_Calendar_Data'; // Adjust path if needed
=======
// Import Issue type and the corrected data
import { Issue } from "../../utils/types"; // Adjust path if needed
import { mockActivityData } from "../../utils/mock_Activity_Calendar_Data"; // Adjust path if needed
import { tokens } from "../../theme";
>>>>>>> origin/dev

// Setup localization using date-fns locales
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
  getDay,
  locales,
});

<<<<<<< HEAD
// Type-safe event structure
type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  channel: string;
  resource?: any; // For potential future use
};

// Map mock data to events
const events: CalendarEvent[] = mockActivityData.map((item, index) => ({
  id: `${item.teamName}-${item.taskName}-${index}`, // Basic unique ID
  title: `${item.teamName}: ${item.taskName}`,
  start: new Date(item.dueDate),
  end: new Date(item.dueDate), // Assuming tasks are single-day for now
  channel: item.teamName.toLowerCase().replace(/ /g, "_"),
}));
=======
// Type-safe event structure for the calendar
type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Issue; // Keep the original Issue data
};

// Map mock data (Issue[]) to CalendarEvent[]
const events: CalendarEvent[] = mockActivityData.map(
  (item: Issue): CalendarEvent => ({
    id: item.id, // Use Issue's numeric id
    title: item.name, // Use Issue's name
    start: item.completed, // Use Issue's completed Date object
    end: item.completed, // Use Issue's completed Date object (assuming single-day events)
    resource: item, // Store the original Issue object
  })
);
>>>>>>> origin/dev

// Type-safe keys for settings
type ThresholdKey = "urgentThreshold" | "upcomingThreshold";
type ColorKey = "urgentColor" | "upcomingColor" | "defaultColor";

interface CalendarSettings {
  urgentThreshold: number;
  upcomingThreshold: number;
  urgentColor: string;
  upcomingColor: string;
  defaultColor: string;
}

const SETTINGS_STORAGE_KEY = "calendarSettings_v1"; // Use a versioned key

// Default Settings
const defaultSettings: CalendarSettings = {
<<<<<<< HEAD
  urgentThreshold: 1, // e.g., Urgent if due within less than 1 day (i.e., today)
  upcomingThreshold: 3, // e.g., Upcoming if due within less than 3 days
=======
  urgentThreshold: 1, // Urgent if due today (diff < 1)
  upcomingThreshold: 3, // Upcoming if due within 1 or 2 days (diff < 3)
>>>>>>> origin/dev
  urgentColor: "#f28b82", // Reddish
  upcomingColor: "#fff475", // Yellowish
  defaultColor: "#ccff90", // Greenish
};

// Component to render the Calendar Toolbar - Updated for specific views
const CustomToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Define the views you want to allow explicitly
<<<<<<< HEAD
  const allowedViews: View[] = useMemo(() => [Views.MONTH, Views.WEEK, Views.DAY], []);
=======
  const allowedViews: View[] = useMemo(
    () => [Views.MONTH, Views.WEEK, Views.DAY],
    []
  );
>>>>>>> origin/dev

  const navigate = (action: NavigateAction) => {
    toolbar.onNavigate(action);
  };

<<<<<<< HEAD
  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: View | null) => {
=======
  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: View | null
  ) => {
>>>>>>> origin/dev
    // Ensure the new view is one of the allowed ones before changing
    if (newView && allowedViews.includes(newView)) {
      toolbar.onView(newView);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
<<<<<<< HEAD
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1, 2),
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.grey[800],
        borderRadius: "8px",
        flexWrap: 'wrap', // Allow wrapping on smaller screens
=======
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1, 2),
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.background.paper, // Use theme paper background
        borderRadius: "8px",
        flexWrap: "wrap", // Allow wrapping on smaller screens
>>>>>>> origin/dev
        gap: theme.spacing(1), // Add gap between wrapped items
      }}
    >
      {/* Navigation Buttons */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Go to Today">
          <IconButton
            size="small"
            onClick={() => navigate(Navigate.TODAY)}
<<<<<<< HEAD
            sx={{ color: theme.palette.primary.contrastText, bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.primary.dark } }}
=======
            sx={{
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
>>>>>>> origin/dev
            aria-label="Go to today"
          >
            <Today />
          </IconButton>
        </Tooltip>
        <Tooltip title="Previous Period">
          <IconButton
            size="small"
            onClick={() => navigate(Navigate.PREVIOUS)}
<<<<<<< HEAD
            sx={{ color: theme.palette.common.white, bgcolor: theme.palette.grey[600], '&:hover': { bgcolor: theme.palette.grey[500] } }}
=======
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.action.hover,
              "&:hover": { bgcolor: theme.palette.action.selected },
            }}
>>>>>>> origin/dev
            aria-label="Go to previous period"
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next Period">
          <IconButton
            size="small"
            onClick={() => navigate(Navigate.NEXT)}
<<<<<<< HEAD
            sx={{ color: theme.palette.common.white, bgcolor: theme.palette.grey[600], '&:hover': { bgcolor: theme.palette.grey[500] } }}
=======
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.action.hover,
              "&:hover": { bgcolor: theme.palette.action.selected },
            }}
>>>>>>> origin/dev
            aria-label="Go to next period"
          >
            <ArrowForward />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Date Label */}
      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{
<<<<<<< HEAD
          color: theme.palette.common.white,
          fontWeight: 600,
          textAlign: 'center',
=======
          color: theme.palette.text.primary, // Use theme text color
          fontWeight: 600,
          textAlign: "center",
>>>>>>> origin/dev
          flexGrow: 1, // Allow label to take available space
          mx: 2, // Margin horizontal
        }}
      >
        {toolbar.label} {/* This label shows the current date range/month */}
      </Typography>

      {/* View Selection Buttons - Using allowedViews */}
      <ToggleButtonGroup
        value={toolbar.view} // Current active view
        exclusive // Only one button active at a time
        onChange={handleViewChange}
        size="small"
        aria-label="Calendar view"
      >
        {allowedViews.map((view) => (
<<<<<<< HEAD
            <ToggleButton
              key={view}
              value={view} // 'month', 'week', or 'day'
              sx={{
                color: theme.palette.common.white,
                borderColor: theme.palette.grey[600],
                // Conditional background color based on selection
                bgcolor: toolbar.view === view ? theme.palette.action.selected : theme.palette.grey[700],
                '&:hover': { bgcolor: theme.palette.grey[600] },
                '&.Mui-selected': { // Styles for the selected button
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    }
                },
                textTransform: 'capitalize', // Display 'Month', 'Week', 'Day'
                minWidth: isMobile ? '55px' : '70px', // Responsive width
                px: isMobile ? 1 : 1.5, // Responsive padding
              }}
            >
              {view} {/* Text content of the button */}
            </ToggleButton>
          )
        )}
=======
          <ToggleButton
            key={view}
            value={view} // 'month', 'week', or 'day'
            sx={{
              color: theme.palette.text.secondary, // Use theme text color
              borderColor: theme.palette.divider, // Use theme divider color
              bgcolor: theme.palette.action.hover, // Use theme background
              "&:hover": { bgcolor: theme.palette.action.selected },
              "&.Mui-selected": {
                // Styles for the selected button
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              textTransform: "capitalize", // Display 'Month', 'Week', 'Day'
              minWidth: isMobile ? "55px" : "70px", // Responsive width
              px: isMobile ? 1 : 1.5, // Responsive padding
            }}
          >
            {view} {/* Text content of the button */}
          </ToggleButton>
        ))}
>>>>>>> origin/dev
      </ToggleButtonGroup>
    </Paper>
  );
};

<<<<<<< HEAD

// Main Calendar Component
const CustomCalendar = () => {
  const navigate = useNavigate();
=======
/**
 * A customizable calendar component using React Big Calendar.
 *
 * This component displays events based on the provided mock data (Issues).
 * Key features include:
 * - Uses `react-big-calendar` with `date-fns` for localization.
 * - Displays events mapped from `mockActivityData` (Issue type).
 * - Features a custom toolbar (`CustomToolbar`) for navigation and view switching (Month, Week, Day).
 * - Allows customization of event colors based on proximity to the due date (Urgent, Upcoming, Default) via a settings panel.
 * - Persists color settings in localStorage.
 * - Styles events differently based on whether they are in the past, present, or future.
 * - Includes basic event selection handling (currently logs to console).
 * - Applies custom dark-theme styling overrides for the calendar elements.
 *
 * @component
 * @example
 * // Used within CalendarPage.tsx
 * <CustomCalendar />
 *
 * @returns {JSX.Element} The CustomCalendar component.
 */
const CustomCalendar: React.FC = () => {
  const navigate = useNavigate(); // Keep navigate if needed for event clicks eventually
>>>>>>> origin/dev
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<View>(Views.MONTH); // Default view
  const [currentDate, setCurrentDate] = useState(new Date()); // Default date (today)
  const [showSettings, setShowSettings] = useState(false); // State for settings panel visibility
<<<<<<< HEAD
=======
  const colors = tokens(theme.palette.mode);
>>>>>>> origin/dev

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<CalendarSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage:", error);
      return defaultSettings; // Fallback to defaults on error
    }
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  // Handler for updating settings state (with basic validation)
<<<<<<< HEAD
  const handleSettingChange = useCallback((field: ThresholdKey | ColorKey, value: number | string) => {
    if ((field === "urgentThreshold" || field === "upcomingThreshold") && typeof value === 'string') {
       const numValue = parseInt(value, 10);
       // Ensure value is a non-negative number
       if (isNaN(numValue) || numValue < 0) return;
       value = numValue;
    }
    setSettings(prev => ({ ...prev, [field]: value }));
  }, []);

  // Function to determine event styling based on due date and settings
  const eventStyleGetter = useCallback((event: CalendarEvent): React.HTMLAttributes<HTMLDivElement> => {
    const now = new Date();
    // Compare based on the start of the day for accurate day difference
    const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventStartDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());

    const diff = differenceInDays(eventStartDay, startOfDayNow); // Days between event start and today
    let backgroundColor = settings.defaultColor;
    let color = theme.palette.getContrastText(settings.defaultColor);
    let opacity = 0.95; // Default opacity for future/current events

    // Apply urgent/upcoming colors only if the event is today or in the future
    if (diff >= 0) {
        if (diff < settings.urgentThreshold) {
            backgroundColor = settings.urgentColor;
            color = theme.palette.getContrastText(settings.urgentColor);
        } else if (diff < settings.upcomingThreshold) {
            backgroundColor = settings.upcomingColor;
            color = theme.palette.getContrastText(settings.upcomingColor);
        }
    } else {
        // Event is in the past
        opacity = 0.7; // Make past events slightly faded
        // Optional: Use a specific color for past events instead of default
        // backgroundColor = theme.palette.grey[600];
        // color = theme.palette.getContrastText(theme.palette.grey[600]);
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: '4px',
        border: 'none',
        opacity: opacity,
        display: 'block',
        padding: '2px 5px',
        fontSize: '0.8em',
        cursor: 'pointer',
      },
    };
  }, [settings, theme]); // Depend on settings and theme

  // Memoize the custom toolbar component to prevent unnecessary re-renders
  const calendarComponents = useMemo(() => ({
    toolbar: CustomToolbar,
    // event: CustomEventComponent, // Example: Add custom event rendering if needed
    // day: { header: CustomDayHeader }, // Example: Customize day headers
  }), []);

  // Navigate to the specific channel when an event is clicked
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    navigate(`/channels/${event.channel}`);
  }, [navigate]);
=======
  const handleSettingChange = useCallback(
    (field: ThresholdKey | ColorKey, value: number | string) => {
      if (
        (field === "urgentThreshold" || field === "upcomingThreshold") &&
        typeof value === "string"
      ) {
        const numValue = parseInt(value, 10);
        // Ensure value is a non-negative number
        if (isNaN(numValue) || numValue < 0) return;
        value = numValue;
      }
      setSettings((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Function to determine event styling based on due date and settings
  const eventStyleGetter = useCallback(
    (event: CalendarEvent): React.HTMLAttributes<HTMLDivElement> => {
      const now = new Date();
      const startOfDayNow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const eventStartDay = new Date(
        event.start.getFullYear(),
        event.start.getMonth(),
        event.start.getDate()
      );

      const diff = differenceInDays(eventStartDay, startOfDayNow);
      let backgroundColor = settings.defaultColor;
      let color = theme.palette.getContrastText(settings.defaultColor);
      let opacity = 0.95;

      if (diff < 0) {
        // Event is in the past
        opacity = 0.7;
      } else {
        // Event is today or in the future
        if (diff < settings.urgentThreshold) {
          // Urgent if due within less than X days (e.g., today if threshold is 1)
          backgroundColor = settings.urgentColor;
          color = theme.palette.getContrastText(settings.urgentColor);
        } else if (diff < settings.upcomingThreshold) {
          // Upcoming if due within less than Y days
          backgroundColor = settings.upcomingColor;
          color = theme.palette.getContrastText(settings.upcomingColor);
        }
      }

      return {
        style: {
          backgroundColor,
          color,
          borderRadius: "4px",
          border: "none",
          opacity: opacity,
          display: "block",
          padding: "2px 5px",
          fontSize: "0.8em",
          cursor: "pointer",
        },
      };
    },
    [settings, theme]
  ); // Depend on settings and theme

  // Memoize the custom toolbar component to prevent unnecessary re-renders
  const calendarComponents = useMemo(
    () => ({
      toolbar: CustomToolbar,
    }),
    []
  );

  // Placeholder: Log event details on click instead of navigating to a non-existent channel
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    console.log("Selected Event:", event);
    // Potential future navigation: navigate(`/issues/${event.id}`) or similar
    // navigate(`/channels/${event.channel}`); // Old navigation removed
  }, []); // Removed navigate dependency for now
>>>>>>> origin/dev

  // Configuration for the settings panel items
  const settingConfig: {
    label: string;
    threshold?: ThresholdKey;
    color: ColorKey;
    helpText?: string;
<<<<<<< HEAD
  }[] = useMemo(() => [
    { label: "Urgent", threshold: "urgentThreshold", color: "urgentColor", helpText: "Task is due in <" },
    { label: "Upcoming", threshold: "upcomingThreshold", color: "upcomingColor", helpText: "Task is due in <" },
    { label: "Default", color: "defaultColor", helpText: "All other future tasks" },
  ], []);

  return (
    // Main container Box - Full height, flex column layout
    <Box sx={{
        paddingTop: { xs: "72px", sm: "80px" }, // Responsive top padding below app bar
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1a1a1a", // Dark background
        color: "#e0e0e0", // Light default text
    }}>
      {/* Header Section (Title and Settings Toggle) */}
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 2, flexShrink: 0 }}> {/* Prevent shrinking */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: "600", letterSpacing: "1px" }}>
            Task Calendar
          </Typography>
          <Tooltip title={showSettings ? "Hide Settings" : "Show Color Settings"}>
            <IconButton onClick={() => setShowSettings(!showSettings)} sx={{ color: '#fff' }}>
=======
  }[] = useMemo(
    () => [
      {
        label: "Urgent",
        threshold: "urgentThreshold",
        color: "urgentColor",
        helpText: "Due <",
      },
      {
        label: "Upcoming",
        threshold: "upcomingThreshold",
        color: "upcomingColor",
        helpText: "Due <",
      },
      { label: "Default", color: "defaultColor", helpText: "Other future" },
    ],
    []
  );

  return (
    // Main container Box
    <Box
      sx={{
        height: "100%", // Let height be controlled by parent container
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 2, flexShrink: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h4"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.text.secondary
                  : colors.grey[600],
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            Task Calendar
          </Typography>
          <Tooltip
            title={showSettings ? "Hide Settings" : "Show Color Settings"}
          >
            <IconButton
              onClick={() => setShowSettings(!showSettings)}
              sx={{ color: theme.palette.text.primary }}
            >
>>>>>>> origin/dev
              <Settings />
            </IconButton>
          </Tooltip>
        </Stack>

<<<<<<< HEAD
        {/* Settings Panel - Conditionally rendered */}
        {showSettings && (
          <Paper sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "12px",
            backgroundColor: theme.palette.grey[800], // Dark paper background
            boxShadow: theme.shadows[5],
            mb: 3, // Margin below settings panel
           }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 3, fontWeight: "600", color: "#fff" }}>
              Customize Task Color Scheme
            </Typography>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {settingConfig.map(({ label, threshold, color, helpText }) => (
                <Grid item xs={12} sm={6} md={4} key={label}> {/* Responsive grid layout */}
                   <Paper elevation={1} sx={{ p: 2, bgcolor: theme.palette.grey[700], borderRadius: '8px' }}>
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                         {/* Left side: Label, Input, Help Text */}
                         <Stack direction="row" spacing={1.5} alignItems="center" flexGrow={1} flexWrap="wrap"> {/* Allow wrapping */}
                            <Typography sx={{ fontWeight: "500", color: "#fff", minWidth: '70px' }}>
                               {label}:
                            </Typography>
                            {threshold && ( // Only show input for Urgent/Upcoming
                                <Tooltip title={`${helpText} threshold value (days)`}>
                                  <TextField
                                    type="number"
                                    value={settings[threshold]}
                                    onChange={(e) => handleSettingChange(threshold, e.target.value)}
                                    sx={{
                                      width: 70,
                                      bgcolor: theme.palette.grey[600], // Input background
                                      borderRadius: "4px",
                                      '& .MuiInputBase-input': {
                                        color: "#fff", // Input text color
                                        textAlign: "center",
                                        padding: '8px 5px' // Adjust input padding
                                      }
                                    }}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{ inputProps: { min: 0, step: 1 } }} // Basic HTML5 validation
                                  />
                                </Tooltip>
                            )}
                             <Typography sx={{ fontSize: 13, color: theme.palette.grey[400], fontStyle: 'italic' }}>
                               {/* Display help text with current value */}
                               {helpText} {threshold ? settings[threshold] : ''} {threshold ? 'day(s)' : ''}
                            </Typography>
                          </Stack>
                          {/* Right side: Color Picker */}
                          <Tooltip title={`Select ${label.toLowerCase()} color`}>
                             <input
                                type="color"
                                value={settings[color]}
                                onChange={(e) => handleSettingChange(color, e.target.value)}
                                style={{
                                   width: 35,
                                   height: 35,
                                   border: `1px solid ${theme.palette.grey[500]}`,
                                   borderRadius: '4px',
                                   cursor: 'pointer',
                                   backgroundColor: 'transparent', // Needed for type="color"
                                }}
                              />
                           </Tooltip>
                      </Stack>
                   </Paper>
=======
        {/* Settings Panel */}
        {showSettings && (
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: "12px",
              backgroundColor: theme.palette.background.paper, // Use theme paper background
              boxShadow: theme.shadows[5],
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 3,
                fontWeight: "600",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.text.secondary
                    : colors.grey[600],
              }}
            >
              Customize Task Color Scheme
            </Typography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              {settingConfig.map(({ label, threshold, color, helpText }) => (
                <Grid item xs={12} sm={6} md={4} key={label}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.action.hover,
                      borderRadius: "8px",
                    }}
                  >
                    {" "}
                    {/* Use theme action background */}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        flexGrow={1}
                        flexWrap="wrap"
                      >
                        <Typography
                          sx={{
                            fontWeight: "500",
                            color: theme.palette.text.primary,
                            minWidth: "70px",
                          }}
                        >
                          {label}:
                        </Typography>
                        {threshold && (
                          <Tooltip title={`${helpText} threshold value (days)`}>
                            <TextField
                              type="number"
                              value={settings[threshold]}
                              onChange={(e) =>
                                handleSettingChange(threshold, e.target.value)
                              }
                              sx={{
                                width: 70,
                                bgcolor: theme.palette.background.default, // Use theme default background
                                borderRadius: "4px",
                                "& .MuiInputBase-input": {
                                  color: theme.palette.text.primary, // Use theme text color
                                  textAlign: "center",
                                  padding: "8px 5px",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              InputProps={{ inputProps: { min: 0, step: 1 } }}
                            />
                          </Tooltip>
                        )}
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: theme.palette.text.secondary,
                            fontStyle: "italic",
                          }}
                        >
                          {" "}
                          {/* Use theme secondary text */}
                          {helpText} {threshold ? settings[threshold] : ""}{" "}
                          {threshold ? "day(s)" : ""}
                        </Typography>
                      </Stack>
                      <Tooltip title={`Select ${label.toLowerCase()} color`}>
                        <input
                          type="color"
                          value={settings[color]}
                          onChange={(e) =>
                            handleSettingChange(color, e.target.value)
                          }
                          style={{
                            width: 35,
                            height: 35,
                            border: `1px solid ${theme.palette.divider}`, // Use theme divider
                            borderRadius: "4px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                          }}
                        />
                      </Tooltip>
                    </Stack>
                  </Paper>
>>>>>>> origin/dev
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>

<<<<<<< HEAD
      {/* Calendar Area - Takes remaining vertical space */}
      <Box sx={{
          flexGrow: 1, // Allow this box to fill available space
          height: "0", // Crucial for flexGrow to work correctly with overflow
          px: { xs: 2, sm: 4 }, // Horizontal padding
          pb: 3, // Padding bottom
          // --- Styling overrides for react-big-calendar elements ---
          '& .rbc-calendar': {
              backgroundColor: theme.palette.grey[900], // Darkest background for calendar grid
              color: "#e0e0e0", // Text color within calendar
              borderRadius: "8px",
              border: `1px solid ${theme.palette.grey[700]}`,
              boxShadow: theme.shadows[3],
              height: "100% !important", // Force calendar to fill container height
          },
          '& .rbc-header': { // Headers for days (e.g., Mon, Tue)
              backgroundColor: theme.palette.grey[800],
              color: "#fff",
              borderBottom: `1px solid ${theme.palette.grey[700]}`,
              padding: '8px 0',
              textAlign: 'center',
              fontWeight: 500,
          },
          '& .rbc-day-bg': { // Background cells for each day
             borderColor: theme.palette.grey[700], // Border color between day cells
             '&:hover': { // Subtle hover effect on day cells
                 backgroundColor: alpha(theme.palette.action.hover, 0.04)
             }
          },
           '& .rbc-today': { // Highlight for today's date cell
              backgroundColor: alpha(theme.palette.primary.dark, 0.2), // Use theme's primary color slightly transparent
           },
          '& .rbc-event': { // Base style for events (colors overridden by eventStyleGetter)
             border: 'none',
             padding: '2px 5px',
             backgroundColor: theme.palette.primary.main, // Default color if getter fails
             color: theme.palette.primary.contrastText,
             borderRadius: '4px',
             // Opacity is handled by eventStyleGetter now
          },
           '& .rbc-event.rbc-selected': { // Style for a clicked/selected event
               backgroundColor: theme.palette.secondary.main, // Use secondary color for selection
               boxShadow: `0 0 0 2px ${theme.palette.secondary.dark}`,
               opacity: 1,
           },
            '& .rbc-event:focus': { // Style for focused event (keyboard nav)
                outline: `2px solid ${theme.palette.secondary.light}`,
                outlineOffset: '1px',
            },
           '& .rbc-off-range-bg': { // Background for days outside the current month view
              backgroundColor: theme.palette.grey[800], // Make slightly different from main calendar bg
              opacity: 0.7, // Fade them slightly
           },
           '& .rbc-time-header, & .rbc-time-gutter': { // Time column headers and gutter (Week/Day view)
             backgroundColor: theme.palette.grey[800],
             color: '#fff',
             borderColor: theme.palette.grey[700],
           },
            '& .rbc-time-slot': { // Horizontal lines in time grid (Week/Day view)
              borderColor: theme.palette.grey[700],
            },
            '& .rbc-current-time-indicator': { // Line showing current time (Week/Day view)
              backgroundColor: theme.palette.error.main, // Bright color for visibility
              height: '2px',
            },
            '& .rbc-show-more': { // Style for the "+X more" link
                color: theme.palette.info.light,
                textDecoration: 'underline',
                fontSize: '0.8em',
            }
       }}>
          {/* The main Calendar component */}
          <Calendar<CalendarEvent>
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={currentView} // Controlled view state
            onView={setCurrentView} // Handler to update view state
            date={currentDate} // Controlled date state
            onNavigate={setCurrentDate} // Handler to update date state (RBC toolbar calls this)
            onSelectEvent={handleSelectEvent} // Handler for clicking an event
            eventPropGetter={eventStyleGetter} // Function to style each event
            components={calendarComponents} // Use our custom toolbar
            views={[Views.MONTH, Views.WEEK, Views.DAY]} // Explicitly define allowed views
            style={{ height: "100%" }} // Ensure calendar takes full height of its container
            formats={{ // Customize date formats displayed in headers/labels
                 monthHeaderFormat: 'MMMM yyyy', // e.g., April 2025
                 // Check localizer exists before formatting
                 dayHeaderFormat: (date, culture, loc) =>
                    loc ? loc.format(date, 'EEEE dd MMM', culture) : '', // e.g., Tuesday 08 Apr
                 dayRangeHeaderFormat: ({ start, end }, culture, loc) => // Format for week view header
                    loc ? loc.format(start, 'MMM dd', culture) +
                          ' - ' +
                          loc.format(end, loc.format(start, 'MMM') === loc.format(end, 'MMM') ? 'dd' : 'MMM dd', culture) // Show month only once if same
                        : '', // e.g., Apr 07 - 13
            }}
            messages={{ // Optional: Customize button texts/labels if needed
                 // today: 'Today!', previous: '<', next: '>', month: 'M', week: 'W', day: 'D'
            }}
            popup // Enable showing overflow events in a popup
            selectable // Allow clicking/dragging on empty slots (optional)
            // onSelectSlot={(slotInfo) => console.log('Selected slot:', slotInfo)} // Handler for selecting empty slots
            tooltipAccessor={(event: CalendarEvent) => `${event.title}\n${format(event.start, 'p')}`} // Basic tooltip on event hover
          />
=======
      {/* Calendar Area */}
      <Box
        sx={{
          flexGrow: 1,
          height: "0", // Important for flexGrow with overflow
          px: { xs: 2, sm: 4 },
          pb: 3,
          // --- Styling overrides --- Use theme colors ---
          "& .rbc-calendar": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
            height: "100% !important",
          },
          "& .rbc-header": {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            padding: "8px 0",
            textAlign: "center",
            fontWeight: 500,
          },
          "& .rbc-day-bg": {
            borderColor: theme.palette.divider,
            "&:hover": {
              backgroundColor: alpha(theme.palette.action.hover, 0.08),
            },
          }, // Slightly darker hover
          "& .rbc-today": {
            backgroundColor: alpha(theme.palette.primary.dark, 0.2),
          },
          "& .rbc-event": {
            border: "none",
            padding: "2px 5px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: "4px",
          },
          "& .rbc-event.rbc-selected": {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: `0 0 0 2px ${theme.palette.secondary.dark}`,
            opacity: 1,
          },
          "& .rbc-event:focus": {
            outline: `2px solid ${theme.palette.secondary.light}`,
            outlineOffset: "1px",
          },
          "& .rbc-off-range-bg": {
            backgroundColor: alpha(
              theme.palette.action.disabledBackground,
              0.5
            ),
          }, // Use disabled background
          "& .rbc-time-header, & .rbc-time-gutter": {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
          },
          "& .rbc-time-slot": { borderColor: theme.palette.divider },
          "& .rbc-current-time-indicator": {
            backgroundColor: theme.palette.error.main,
            height: "2px",
          },
          "& .rbc-show-more": {
            color: theme.palette.info.light,
            textDecoration: "underline",
            fontSize: "0.8em",
          },
        }}
      >
        {/* The main Calendar component */}
        <Calendar<CalendarEvent>
          localizer={localizer}
          events={events} // Use the correctly mapped events
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleSelectEvent} // Use updated handler
          eventPropGetter={eventStyleGetter}
          components={calendarComponents}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          style={{ height: "100%" }}
          formats={{
            // FIX: Changed monthHeaderFormat
            monthHeaderFormat: "MMM yyyy", // e.g., Apr 2025
            dayHeaderFormat: (date, culture, loc) =>
              loc ? loc.format(date, "EEEE dd MMM", culture) : "", // e.g., Tuesday 08 Apr
            dayRangeHeaderFormat: ({ start, end }, culture, loc) =>
              loc
                ? loc.format(start, "MMM dd", culture) +
                  " - " +
                  loc.format(
                    end,
                    loc.format(start, "MMM") === loc.format(end, "MMM")
                      ? "dd"
                      : "MMM dd",
                    culture
                  )
                : "", // e.g., Apr 07 - 13
          }}
          messages={
            {
              /* Custom messages if needed */
            }
          }
          popup
          selectable
          tooltipAccessor={(event: CalendarEvent) =>
            `${event.title}\n${format(event.start, "p")}`
          } // Tooltip format
        />
>>>>>>> origin/dev
      </Box>
    </Box>
  );
};

<<<<<<< HEAD
export default CustomCalendar;
=======
export default CustomCalendar;
>>>>>>> origin/dev
