import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Paper,
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
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  differenceInDays,
  isSameDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/CalendarStyles.css"; // Assuming you have custom styles here
import { ArrowBack, ArrowForward, Today, Settings } from "@mui/icons-material";
// Import Issue type and the corrected data
import { Issue } from "../../utils/types"; // Adjust path if needed
import { mockActivityData } from "../../utils/mock_Activity_Calendar_Data"; // Adjust path if needed
import { tokens } from "../../theme";

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

// Type-safe event structure for the calendar
type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Issue; // Keep the original Issue data
};

// Map mock data (Issue[]) to CalendarEvent[]
const events: CalendarEvent[] = mockActivityData
  .filter((item): item is Issue & { completed: Date } => !!item.completed)
  .map(
    (item): CalendarEvent => ({
      id: item.id,
      title: item.title,
      start: item.completed,
      end: item.completed,
      resource: item,
    })
  );

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
  urgentThreshold: 1, // Urgent if due today (diff < 1)
  upcomingThreshold: 3, // Upcoming if due within 1 or 2 days (diff < 3)
  urgentColor: "#f28b82", // Reddish
  upcomingColor: "#fff475", // Yellowish
  defaultColor: "#ccff90", // Greenish
};

// Component to render the Calendar Toolbar - Updated for specific views
const CustomToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Define the views you want to allow explicitly
  const allowedViews: View[] = useMemo(
    () => [Views.MONTH, Views.WEEK, Views.DAY],
    []
  );

  const navigate = (action: NavigateAction) => {
    toolbar.onNavigate(action);
  };

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: View | null
  ) => {
    // Ensure the new view is one of the allowed ones before changing
    if (newView && allowedViews.includes(newView)) {
      toolbar.onView(newView);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1, 2),
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.background.paper, // Use theme paper background
        borderRadius: "8px",
        flexWrap: "wrap", // Allow wrapping on smaller screens
        gap: theme.spacing(1), // Add gap between wrapped items
      }}
    >
      {/* Navigation Buttons */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Go to Today">
          <IconButton
            size="small"
            onClick={() => navigate(Navigate.TODAY)}
            sx={{
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
            aria-label="Go to today"
          >
            <Today />
          </IconButton>
        </Tooltip>
        <Tooltip title="Previous Period">
          <IconButton
            size="small"
            onClick={() => navigate(Navigate.PREVIOUS)}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.action.hover,
              "&:hover": { bgcolor: theme.palette.action.selected },
            }}
            aria-label="Go to previous period"
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next Period">
          <IconButton
            size="small"
            onClick={() => navigate(Navigate.NEXT)}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.action.hover,
              "&:hover": { bgcolor: theme.palette.action.selected },
            }}
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
          color: theme.palette.text.primary, // Use theme text color
          fontWeight: 600,
          textAlign: "center",
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
      </ToggleButtonGroup>
    </Paper>
  );
};

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
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<View>(Views.MONTH); // Default view
  const [currentDate, setCurrentDate] = useState(new Date()); // Default date (today)
  const [showSettings, setShowSettings] = useState(false); // State for settings panel visibility
  const colors = tokens(theme.palette.mode);

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
              <Settings />
            </IconButton>
          </Tooltip>
        </Stack>

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
                      bgcolor: theme.palette.action.hover, // Use theme action background
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
                          <Tooltip
                            title={`${helpText} threshold value (days)`}
                          >
                            <TextField
                              type="number"
                              value={settings[threshold]}
                              onChange={(e) =>
                                handleSettingChange(threshold, e.target.value)
                              }
                              sx={{
                                width: 70,
                                bgcolor:
                                  theme.palette.background.default, // Use theme default background
                                borderRadius: "4px",
                                "& .MuiInputBase-input": {
                                  color: theme.palette.text.primary, // Use theme text color
                                  textAlign: "center",
                                  padding: "8px 5px",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                inputProps: { min: 0, step: 1 },
                              }}
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
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Calendar Area - Takes remaining vertical space */}
      <Box
        sx={{
          flexGrow: 1, // Allow this box to fill available space
          height: "0", // Crucial for flexGrow to work correctly with overflow
          px: { xs: 2, sm: 4 }, // Horizontal padding
          pb: 3, // Padding bottom
          // --- Styling overrides for react-big-calendar elements ---
          "& .rbc-calendar": {
            backgroundColor: theme.palette.background.paper, // Darkest background for calendar grid
            color: theme.palette.text.primary, // Text color within calendar
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
            height: "100% !important", // Force calendar to fill container height
          },
          "& .rbc-header": {
            // Headers for days (e.g., Mon, Tue)
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            padding: "8px 0",
            textAlign: "center",
            fontWeight: 500,
          },
          "& .rbc-day-bg": {
            // Background cells for each day
            borderColor: theme.palette.divider, // Border color between day cells
            "&:hover": {
              // Subtle hover effect on day cells
              backgroundColor: alpha(theme.palette.action.hover, 0.04),
            },
          },
          "& .rbc-today": {
            // Highlight for today's date cell
            backgroundColor: alpha(theme.palette.primary.dark, 0.2), // Use theme's primary color slightly transparent
          },
          "& .rbc-event": {
            // Base style for events (colors overridden by eventStyleGetter)
            border: "none",
            padding: "2px 5px",
            backgroundColor: theme.palette.primary.main, // Default color if getter fails
            color: theme.palette.primary.contrastText,
            borderRadius: "4px",
            // Opacity is handled by eventStyleGetter now
          },
          "& .rbc-event.rbc-selected": {
            // Style for a clicked/selected event
            backgroundColor: theme.palette.secondary.main, // Use secondary color for selection
            boxShadow: `0 0 0 2px ${theme.palette.secondary.dark}`,
            opacity: 1,
          },
          "& .rbc-event:focus": {
            // Style for focused event (keyboard nav)
            outline: `2px solid ${theme.palette.secondary.light}`,
            outlineOffset: "1px",
          },
          "& .rbc-off-range-bg": {
            // Background for days outside the current month view
            backgroundColor: alpha(
              theme.palette.action.disabledBackground,
              0.5
            ), // Make slightly different from main calendar bg
          },
          "& .rbc-time-header, & .rbc-time-gutter": {
            // Time column headers and gutter (Week/Day view)
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
          },
          "& .rbc-time-slot": {
            // Horizontal lines in time grid (Week/Day view)
            borderColor: theme.palette.divider,
          },
          "& .rbc-current-time-indicator": {
            // Line showing current time (Week/Day view)
            backgroundColor: theme.palette.error.main, // Bright color for visibility
            height: "2px",
          },
          "& .rbc-show-more": {
            // Style for the "+X more" link
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
          view={currentView} // Controlled view state
          onView={setCurrentView} // Handler to update view state
          date={currentDate} // Controlled date state
          onNavigate={setCurrentDate} // Handler to update date state (RBC toolbar calls this)
          onSelectEvent={handleSelectEvent} // Handler for clicking an event
          eventPropGetter={eventStyleGetter} // Function to style each event
          components={calendarComponents} // Use our custom toolbar
          views={[Views.MONTH, Views.WEEK, Views.DAY]} // Explicitly define allowed views
          style={{ height: "100%" }} // Ensure calendar takes full height of its container
          formats={{
            // FIX: Changed monthHeaderFormat
            monthHeaderFormat: "