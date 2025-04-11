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
    useTheme,
    useMediaQuery,
    Grid,
    alpha,
    Button // Added Button for Reset Settings
} from "@mui/material";
import {
    Calendar,
    dateFnsLocalizer,
    View,
    Views,
    NavigateAction,
    ToolbarProps,
    Navigate,
    EventProps, // Added EventProps type
} from "react-big-calendar";
import {
    format,
    parse,
    startOfWeek,
    getDay,
    differenceInDays,
    parseISO, // Use parseISO for robust date parsing
    isValid, // Use isValid to check date validity
    isBefore, // Use isBefore for date comparison
    // addDays, // Not directly used now, but available
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/CalendarStyles.css"; // Keep custom styles if needed
import { ArrowBack, ArrowForward, Today, Settings, Restore, PriorityHigh as PriorityHighIcon } from "@mui/icons-material"; // Added PriorityHighIcon

// --- Import Correct Data and Helpers ---
import {
    mockIssues,
    MockIssue,
    getProjectName,
    mockUsers, // Import mockUsers for names
    MockUser  // Import MockUser type
} from '../../utils/mock_Activity_Calendar_Data'; // Adjust path if needed

// --- Helper Functions (copied/adapted from Activity.tsx for consistency) ---
const getUserName = (userId?: number): string => {
    if (userId === undefined || userId === null) return "Unassigned";
    const user: MockUser | undefined = mockUsers.find(u => u.id === userId);
    return user ? user.name.split(' ')[0] : `Unknown`; // Use first name or shorter identifier for brevity in calendar
};

const getPriorityDetails = (priority: 1 | 2 | 3): { text: string; color: "error" | "warning" | "success"; icon: React.ReactElement } => {
    switch (priority) {
        case 1: return { text: "High", color: "error", icon: <PriorityHighIcon sx={{ fontSize: 'inherit' }}/> };
        case 2: return { text: "Medium", color: "warning", icon: <PriorityHighIcon sx={{ fontSize: 'inherit', opacity: 0.7 }}/> };
        case 3: return { text: "Low", color: "success", icon: <PriorityHighIcon sx={{ fontSize: 'inherit', opacity: 0.5 }}/> };
        default: return { text: "Unknown", color: "success", icon: <PriorityHighIcon sx={{ fontSize: 'inherit' }} /> };
    }
};
// --- End Helper Functions ---


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

// --- Updated Type-safe event structure ---
// Includes relevant info from MockIssue in 'resource'
type CalendarEvent = {
    id: string; // Use MockIssue ID
    title: string; // Generated title (Project: Issue Name)
    start: Date; // Parsed deadline
    end: Date; // Parsed deadline (assuming single day events)
    allDay: boolean; // Assume all day
    resource: {
        issueId: number;
        projectId: number;
        priority: 1 | 2 | 3;
        assignedMemberId?: number;
        cost?: number;
        // Add other fields if needed for display/logic
    };
};

// --- Map mock data to events (Corrected) ---
const events: CalendarEvent[] = mockIssues
    .map((item: MockIssue): CalendarEvent | null => {
        try {
            // Parse the deadline string into a Date object
            const startDate = parseISO(item.deadline + 'T00:00:00Z'); // Assume UTC time for consistency
            if (!isValid(startDate)) {
                console.warn(`Invalid deadline date found for issue ID ${item.id}: ${item.deadline}`);
                return null; // Skip issues with invalid dates
            }
            // Assuming events span a single day for now
            const endDate = startDate;

            return {
                id: item.id.toString(), // Use issue ID as event ID
                title: `${getProjectName(item.projectId)}: ${item.name}`,
                start: startDate,
                end: endDate,
                allDay: true, // Assume tasks are all-day events on their deadline
                resource: {
                    issueId: item.id,
                    projectId: item.projectId,
                    priority: item.priority,
                    assignedMemberId: item.assignedMemberId,
                    cost: item.cost,
                },
            };
        } catch (error) {
            console.error(`Error processing issue ID ${item.id}:`, error);
            return null; // Skip issues that cause errors during processing
        }
    })
    .filter((event): event is CalendarEvent => event !== null); // Filter out null values (invalid dates/errors)


// --- Settings Logic (mostly unchanged, added Reset) ---
type ThresholdKey = "urgentThreshold" | "upcomingThreshold";
type ColorKey = "urgentColor" | "upcomingColor" | "defaultColor";

interface CalendarSettings {
    urgentThreshold: number;
    upcomingThreshold: number;
    urgentColor: string;
    upcomingColor: string;
    defaultColor: string;
}

const SETTINGS_STORAGE_KEY = "calendarSettings_v2"; // Updated key version

const defaultSettings: CalendarSettings = {
    urgentThreshold: 2, // Urgent if due within less than 2 days (today or tomorrow)
    upcomingThreshold: 7, // Upcoming if due within less than 7 days
    urgentColor: "#d93025", // Google Keep Red
    upcomingColor: "#ffc107", // Amber/Yellow
    defaultColor: "#1e8e3e", // Green
};

// --- Custom Toolbar Component (Unchanged from previous version) ---
const CustomToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const allowedViews: View[] = useMemo(() => [Views.MONTH, Views.WEEK, Views.DAY], []);

    const navigate = (action: NavigateAction) => toolbar.onNavigate(action);
    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: View | null) => {
        if (newView && allowedViews.includes(newView)) toolbar.onView(newView);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: theme.spacing(1, 2), marginBottom: theme.spacing(2),
                backgroundColor: theme.palette.grey[800], borderRadius: "8px",
                flexWrap: 'wrap', gap: theme.spacing(1),
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Go to Today">
                    <IconButton size="small" onClick={() => navigate(Navigate.TODAY)} sx={{ color: theme.palette.primary.contrastText, bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.primary.dark } }} aria-label="Go to today"><Today /></IconButton>
                </Tooltip>
                <Tooltip title="Previous Period">
                    <IconButton size="small" onClick={() => navigate(Navigate.PREVIOUS)} sx={{ color: theme.palette.common.white, bgcolor: theme.palette.grey[600], '&:hover': { bgcolor: theme.palette.grey[500] } }} aria-label="Go to previous period"><ArrowBack /></IconButton>
                </Tooltip>
                <Tooltip title="Next Period">
                    <IconButton size="small" onClick={() => navigate(Navigate.NEXT)} sx={{ color: theme.palette.common.white, bgcolor: theme.palette.grey[600], '&:hover': { bgcolor: theme.palette.grey[500] } }} aria-label="Go to next period"><ArrowForward /></IconButton>
                </Tooltip>
            </Stack>
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ color: theme.palette.common.white, fontWeight: 600, textAlign: 'center', flexGrow: 1, mx: 2 }}>
                {toolbar.label}
            </Typography>
            <ToggleButtonGroup value={toolbar.view} exclusive onChange={handleViewChange} size="small" aria-label="Calendar view">
                {allowedViews.map((view) => (
                    <ToggleButton key={view} value={view} sx={{ color: theme.palette.common.white, borderColor: theme.palette.grey[600], bgcolor: toolbar.view === view ? theme.palette.action.selected : theme.palette.grey[700], '&:hover': { bgcolor: theme.palette.grey[600] }, '&.Mui-selected': { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark, } }, textTransform: 'capitalize', minWidth: isMobile ? '55px' : '70px', px: isMobile ? 1 : 1.5, }}>
                        {view}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Paper>
    );
};


// --- Simple Custom Event Component ---
// Displays priority icon and title
const CustomEventComponent = ({ event }: EventProps<CalendarEvent>) => {
    const priorityDetails = getPriorityDetails(event.resource.priority);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', overflow: 'hidden', px: '2px' }}>
        <Tooltip title={`Priority: ${priorityDetails.text}`}>
            <Box component="span" sx={{ mr: 0.5, color: 'inherit', display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
                {priorityDetails.icon}
            </Box>
        </Tooltip>
        <Typography variant="caption" component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit', lineHeight: 1.2 }}>
          {event.title}
        </Typography>
      </Box>
    );
  };


// --- Main Calendar Component ---
const CustomCalendar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showSettings, setShowSettings] = useState(false);

    const [settings, setSettings] = useState<CalendarSettings>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
            // Merge stored settings with defaults to ensure all keys exist
            const storedSettings = stored ? JSON.parse(stored) : {};
            return { ...defaultSettings, ...storedSettings };
        } catch (error) {
            console.error("Failed to parse settings from localStorage:", error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings to localStorage:", error);
        }
    }, [settings]);

    const handleSettingChange = useCallback((field: ThresholdKey | ColorKey, value: number | string) => {
        if ((field === "urgentThreshold" || field === "upcomingThreshold") && typeof value === 'string') {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue < 0) return;
            value = numValue;
        }
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(defaultSettings);
    }, []);

    // Updated event styling function
    const eventStyleGetter = useCallback((event: CalendarEvent): React.HTMLAttributes<HTMLDivElement> => {
        const now = new Date();
        const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventStartDay = event.start; // Use the already parsed Date object

        // Ensure the event date is valid before comparison
        if (!isValid(eventStartDay)) {
            return { style: { display: 'none' } }; // Hide invalid events (should have been filtered already)
        }

        const diff = differenceInDays(eventStartDay, startOfDayNow);
        let baseColor = settings.defaultColor;
        let opacity = 1.0; // Default opacity
        let isPast = false;

        // Check if event is in the past
        if (isBefore(eventStartDay, startOfDayNow)) {
            isPast = true;
            baseColor = theme.palette.grey[600]; // Specific grey for past events
            opacity = 0.65; // Make past events more faded
        } else {
            // Event is today or in the future
            if (diff < settings.urgentThreshold) {
                baseColor = settings.urgentColor;
            } else if (diff < settings.upcomingThreshold) {
                baseColor = settings.upcomingColor;
            }
        }

        const contrastColor = theme.palette.getContrastText(baseColor);

        return {
            style: {
                backgroundColor: baseColor,
                color: contrastColor,
                borderRadius: '4px',
                border: `1px solid ${alpha(contrastColor, 0.3)}`, // Subtle border using contrast color
                opacity: opacity,
                padding: '1px 3px', // Slightly reduced padding
                fontSize: '0.78em', // Slightly smaller font size
                cursor: 'pointer',
                boxShadow: isPast ? 'none' : `0 1px 2px ${alpha(theme.palette.common.black, 0.2)}`, // Subtle shadow for future events
            },
        };
    }, [settings, theme]);

    // Updated calendar components memo including custom event
    const calendarComponents = useMemo(() => ({
        toolbar: CustomToolbar,
        event: CustomEventComponent, // Use the custom event component
    }), []);

    // Updated event selection handler (uses resource data)
    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        navigate(`/project/${event.resource.projectId}/issue/${event.resource.issueId}`);
    }, [navigate]);

    // Updated tooltip accessor
    const tooltipAccessor = useCallback((event: CalendarEvent): string => {
        const priority = getPriorityDetails(event.resource.priority).text;
        const assigned = getUserName(event.resource.assignedMemberId);
        return `Issue: ${event.title.split(': ')[1]}\nProject: ${event.title.split(': ')[0]}\nPriority: ${priority}\nAssigned: ${assigned}\nDeadline: ${format(event.start, 'PPP')}`; // Use PPP for locale date format
    }, []);

    // Setting config (Unchanged)
    const settingConfig: { label: string; threshold?: ThresholdKey; color: ColorKey; helpText?: string }[] = useMemo(() => [
        { label: "Urgent", threshold: "urgentThreshold", color: "urgentColor", helpText: "Due in <" },
        { label: "Upcoming", threshold: "upcomingThreshold", color: "upcomingColor", helpText: "Due in <" },
        { label: "Default", color: "defaultColor", helpText: "Other future tasks" },
    ], []);

    return (
        <Box sx={{ paddingTop: { xs: "72px", sm: "80px" }, height: "100vh", display: "flex", flexDirection: "column", bgcolor: theme.palette.grey[900], color: "#e0e0e0" }}>
            {/* Header */}
            <Box sx={{ px: { xs: 2, sm: 4 }, py: 2, flexShrink: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h4" sx={{ color: "#fff", fontWeight: "600" }}>Task Calendar</Typography>
                    <Tooltip title={showSettings ? "Hide Settings" : "Show Color Settings"}>
                        <IconButton onClick={() => setShowSettings(!showSettings)} sx={{ color: '#fff' }}><Settings /></IconButton>
                    </Tooltip>
                </Stack>

                {/* Settings Panel */}
                {showSettings && (
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: "12px", backgroundColor: theme.palette.grey[800], boxShadow: theme.shadows[5], mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                           <Typography variant="h6" sx={{ fontWeight: "600", color: "#fff" }}>Customize Task Colors</Typography>
                           <Tooltip title="Reset to Defaults">
                              <Button variant="outlined" size="small" onClick={resetSettings} startIcon={<Restore />} sx={{ color: theme.palette.info.light, borderColor: theme.palette.info.dark }}>Reset</Button>
                           </Tooltip>
                        </Stack>
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                            {settingConfig.map(({ label, threshold, color, helpText }) => (
                                <Grid item xs={12} md={6} lg={4} key={label}> {/* Adjust grid breakpoints */}
                                    <Paper elevation={1} sx={{ p: 2, bgcolor: theme.palette.grey[700], borderRadius: '8px' }}>
                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                                            <Stack spacing={0.5} flexGrow={1}>
                                                 <Typography sx={{ fontWeight: "500", color: "#fff", minWidth: '70px' }}>{label}:</Typography>
                                                 <Typography sx={{ fontSize: 12, color: theme.palette.grey[400], fontStyle: 'italic' }}>
                                                      {/* Display help text with current value */}
                                                      {helpText} {threshold ? settings[threshold] : ''} {threshold ? 'day(s)' : ''}
                                                 </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
                                                {threshold && (
                                                    <Tooltip title={`Threshold value (days)`}>
                                                        <TextField type="number" value={settings[threshold]} onChange={(e) => handleSettingChange(threshold, e.target.value)}
                                                            sx={{ width: 65, bgcolor: theme.palette.grey[600], borderRadius: "4px", '& .MuiInputBase-input': { color: "#fff", textAlign: "center", padding: '8px 5px' } }}
                                                            variant="outlined" size="small" InputProps={{ inputProps: { min: 0, step: 1 } }} />
                                                    </Tooltip>
                                                )}
                                                <Tooltip title={`Select ${label.toLowerCase()} color`}>
                                                    <input type="color" value={settings[color]} onChange={(e) => handleSettingChange(color, e.target.value)}
                                                        style={{ width: 35, height: 35, border: `1px solid ${theme.palette.grey[500]}`, borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent', }} />
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}
            </Box>

            {/* Calendar Area */}
            <Box sx={{
                flexGrow: 1, height: "0", px: { xs: 1, sm: 2, md: 4 }, pb: 3, // Adjusted padding for smaller screens
                // --- Styling overrides for react-big-calendar ---
                '& .rbc-calendar': { bgcolor: theme.palette.grey[900], color: "#e0e0e0", borderRadius: "8px", border: `1px solid ${theme.palette.grey[700]}`, boxShadow: theme.shadows[3], height: "100% !important" },
                '& .rbc-header': { bgcolor: theme.palette.grey[800], color: "#fff", borderBottom: `1px solid ${theme.palette.grey[700]}`, padding: '8px 0', textAlign: 'center', fontWeight: 500 },
                '& .rbc-day-bg': { borderColor: theme.palette.grey[700], '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.04) } },
                '& .rbc-today': { backgroundColor: alpha(theme.palette.primary.dark, 0.25) }, // Slightly stronger today highlight
                '& .rbc-event': { /* Base styles handled by getter */ },
                '& .rbc-event-content': { overflow: 'hidden' }, // Ensure content respects event bounds
                '& .rbc-event.rbc-selected': { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, boxShadow: `0 0 0 2px ${theme.palette.secondary.dark}`, opacity: '1 !important' }, // Ensure opacity is 1 on select
                '& .rbc-event:focus': { outline: `2px solid ${theme.palette.secondary.light}`, outlineOffset: '1px', boxShadow: `0 0 0 2px ${theme.palette.secondary.dark}` }, // Focus style
                '& .rbc-off-range-bg': { backgroundColor: theme.palette.grey[800], opacity: 0.7 },
                '& .rbc-time-header, & .rbc-time-gutter': { bgcolor: theme.palette.grey[800], color: '#fff', borderColor: theme.palette.grey[700] },
                '& .rbc-time-slot': { borderColor: theme.palette.grey[700] },
                '& .rbc-current-time-indicator': { backgroundColor: theme.palette.error.main, height: '2px' },
                '& .rbc-show-more': { color: theme.palette.info.light, textDecoration: 'underline', fontSize: '0.8em', backgroundColor: 'transparent !important', '&:hover': { color: theme.palette.info.main } } // Style show more link
            }}>
                <Calendar<CalendarEvent>
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    allDayAccessor="allDay" // Added allDayAccessor
                    view={currentView}
                    onView={setCurrentView}
                    date={currentDate}
                    onNavigate={setCurrentDate}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    components={calendarComponents}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    style={{ height: "100%" }}
                    formats={{
                         monthHeaderFormat: 'MMMM yyyy',
                         dayHeaderFormat: (date, culture, loc) => loc ? loc.format(date, 'EEE dd MMM', culture) : '', // Short day name
                         dayRangeHeaderFormat: ({ start, end }, culture, loc) =>
                            loc ? loc.format(start, 'MMM dd', culture) + ' - ' + loc.format(end, loc.format(start, 'MMM') === loc.format(end, 'MMM') ? 'dd' : 'MMM dd', culture) : '',
                    }}
                    popup
                    selectable
                    tooltipAccessor={tooltipAccessor} // Use the detailed tooltip
                />
            </Box>
        </Box>
    );
};

export default CustomCalendar;