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
    useTheme, // Keep useTheme
    useMediaQuery,
    Grid,
    alpha,
    Button,
    Theme, // Import Theme type
} from "@mui/material";
import {
    Calendar,
    dateFnsLocalizer,
    View,
    Views,
    NavigateAction,
    ToolbarProps,
    Navigate,
    EventProps,
} from "react-big-calendar";
import {
    format,
    parse,
    startOfWeek,
    getDay,
    differenceInDays,
    parseISO,
    isValid,
    isBefore,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
// Consider removing or cleaning this if it conflicts
import "../../css/CalendarStyles.css";
import { ArrowBack, ArrowForward, Today, Settings, Restore, PriorityHigh as PriorityHighIcon } from "@mui/icons-material";

// --- Import Correct Data and Helpers ---
import {
    mockIssues,
    MockIssue,
    getProjectName,
    mockUsers,
    MockUser
} from '../../utils/mock_Activity_Calendar_Data'; // Adjust path if needed

// --- Helper Functions ---
// (Keep the previous fix: Pass theme explicitly)
const getUserName = (userId?: number): string => {
    if (userId === undefined || userId === null) return "Unassigned";
    const user: MockUser | undefined = mockUsers.find(u => u.id === userId);
    return user ? user.name.split(' ')[0] : `Unknown`;
};

// Pass theme to get themed icons/colors if needed later, but keep simple for now
const getPriorityDetails = (priority: 1 | 2 | 3, theme: Theme): { text: string; color: "error" | "warning" | "success"; icon: React.ReactElement } => {
    // Using theme colors for icons (optional enhancement)
    const colors = {
        error: theme.palette.error.main,
        warning: theme.palette.warning.main,
        success: theme.palette.success.main,
    };
    switch (priority) {
        case 1: return { text: "High", color: "error", icon: <PriorityHighIcon sx={{ fontSize: 'inherit', color: colors.error }}/> };
        case 2: return { text: "Medium", color: "warning", icon: <PriorityHighIcon sx={{ fontSize: 'inherit', color: colors.warning, opacity: 0.8 }}/> };
        case 3: return { text: "Low", color: "success", icon: <PriorityHighIcon sx={{ fontSize: 'inherit', color: colors.success, opacity: 0.6 }}/> };
        default: return { text: "Unknown", color: "success", icon: <PriorityHighIcon sx={{ fontSize: 'inherit' }} /> };
    }
};
// --- End Helper Functions ---


// Setup localization (no changes)
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

// --- Event Structure (no changes) ---
type CalendarEvent = { id: string; title: string; start: Date; end: Date; allDay: boolean; resource: { issueId: number; projectId: number; priority: 1 | 2 | 3; assignedMemberId?: number; cost?: number; }; };

// --- Map mock data to events (no changes) ---
const events: CalendarEvent[] = mockIssues
    .map((item: MockIssue): CalendarEvent | null => {
        try {
            const startDate = parseISO(item.deadline + 'T00:00:00Z');
            if (!isValid(startDate)) return null;
            return {
                id: item.id.toString(), title: `${getProjectName(item.projectId)}: ${item.name}`, start: startDate, end: startDate, allDay: true,
                resource: { issueId: item.id, projectId: item.projectId, priority: item.priority, assignedMemberId: item.assignedMemberId, cost: item.cost },
            };
        } catch (error) { return null; }
    })
    .filter((event): event is CalendarEvent => event !== null);


// --- Settings Logic ---
// (Keep previous fix: Pass theme to default settings)
type ThresholdKey = "urgentThreshold" | "upcomingThreshold";
// Add pastColor support later if needed
type ColorKey = "urgentColor" | "upcomingColor" | "defaultColor" | "pastColor";

interface CalendarSettings {
    urgentThreshold: number;
    upcomingThreshold: number;
    urgentColor: string;
    upcomingColor: string;
    defaultColor: string;
    pastColor: string; // Keep for consistency if eventStyleGetter uses it
}

const SETTINGS_STORAGE_KEY = "calendarSettings_v3"; // Keep version

// Pass theme to get defaults
const getDefaultSettings = (theme: Theme): CalendarSettings => ({
    urgentThreshold: 2,
    upcomingThreshold: 7,
    urgentColor: theme.palette.error.main,
    upcomingColor: theme.palette.warning.main,
    defaultColor: theme.palette.success.main,
    pastColor: theme.palette.grey[500],
});

// --- Custom Toolbar Component ---
// (Keep previous Toolbar - it doesn't affect layout)
const CustomToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const allowedViews: View[] = useMemo(() => [Views.MONTH, Views.WEEK, Views.DAY], []);
    const navigate = (action: NavigateAction) => toolbar.onNavigate(action);
    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: View | null) => { if (newView && allowedViews.includes(newView)) toolbar.onView(newView); };

    // Basic Toolbar styling, ensuring it fits within the flow
    return (
        <Paper
            elevation={0} // Less intrusive elevation
            variant="outlined"
            sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: theme.spacing(1, 1.5), marginBottom: theme.spacing(2), // Spacing below toolbar
                backgroundColor: theme.palette.background.paper, // Use theme background
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px', // Standard rounding
                flexWrap: 'wrap', gap: theme.spacing(1),
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Go to Today">
                    <IconButton size="small" onClick={() => navigate(Navigate.TODAY)} sx={{ color: theme.palette.primary.main }}><Today /></IconButton>
                </Tooltip>
                <Tooltip title="Previous Period">
                    <IconButton size="small" onClick={() => navigate(Navigate.PREVIOUS)} sx={{ color: theme.palette.text.secondary }}><ArrowBack /></IconButton>
                </Tooltip>
                 <Tooltip title="Next Period">
                    <IconButton size="small" onClick={() => navigate(Navigate.NEXT)} sx={{ color: theme.palette.text.secondary }}><ArrowForward /></IconButton>
                </Tooltip>
            </Stack>
            <Typography variant={isMobile ? "body1" : "h6"} sx={{ fontWeight: 500, textAlign: 'center', flexGrow: 1, mx: 1 }}>
                {toolbar.label}
            </Typography>
            <ToggleButtonGroup value={toolbar.view} exclusive onChange={handleViewChange} size="small">
                 {allowedViews.map((view) => ( <ToggleButton key={view} value={view} sx={{textTransform: 'capitalize'}}>{view}</ToggleButton> ))}
            </ToggleButtonGroup>
        </Paper>
    );
};


// --- Custom Event Component ---
// (Keep previous Event Component - it doesn't affect layout)
const CustomEventComponent = ({ event }: EventProps<CalendarEvent>) => {
    const theme = useTheme();
    const priorityDetails = getPriorityDetails(event.resource.priority, theme); // Pass theme
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', overflow: 'hidden', px: 0.5, py: 0.25 }}>
        <Tooltip title={`Priority: ${priorityDetails.text}`}>
            <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
                {priorityDetails.icon}
            </Box>
        </Tooltip>
        <Typography variant="caption" component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit', lineHeight: 1.2, fontSize: '0.75rem' }}>
          {event.title}
        </Typography>
      </Box>
    );
};


// --- Main Calendar Component ---
const CustomCalendar = () => {
    const navigate = useNavigate();
    const theme = useTheme(); // Get theme here
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showSettings, setShowSettings] = useState(false);

    // Keep previous state initialization/effects for settings
    const [settings, setSettings] = useState<CalendarSettings>(() => {
        const defaults = getDefaultSettings(theme);
        try { const stored = localStorage.getItem(SETTINGS_STORAGE_KEY); return { ...defaults, ...(stored ? JSON.parse(stored) : {}) }; }
        catch (error) { console.error("Failed to parse settings:", error); return defaults; }
    });
    useEffect(() => { try { localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings)); } catch (error) { console.error("Failed to save settings:", error); } }, [settings]);
    // Effect to update potentially theme-dependent *default* colors if theme changes, but keep user overrides
    useEffect(() => {
        const themeDefaults = getDefaultSettings(theme);
        setSettings(prev => ({
            ...prev,
            urgentColor: prev.urgentColor === themeDefaults.urgentColor ? themeDefaults.urgentColor : prev.urgentColor,
            upcomingColor: prev.upcomingColor === themeDefaults.upcomingColor ? themeDefaults.upcomingColor : prev.upcomingColor,
            defaultColor: prev.defaultColor === themeDefaults.defaultColor ? themeDefaults.defaultColor : prev.defaultColor,
            pastColor: prev.pastColor === themeDefaults.pastColor ? themeDefaults.pastColor : prev.pastColor,
        }));
    }, [theme]);
    const handleSettingChange = useCallback((field: keyof CalendarSettings, value: number | string) => {
        if ((field === "urgentThreshold" || field === "upcomingThreshold") && typeof value === 'string') {
            const numValue = parseInt(value, 10); if (isNaN(numValue) || numValue < 0) return; value = numValue;
        }
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);
    const resetSettings = useCallback(() => { setSettings(getDefaultSettings(theme)); }, [theme]);

    // Event Styling Function (minimal changes needed for layout)
    const eventStyleGetter = useCallback((event: CalendarEvent): React.HTMLAttributes<HTMLDivElement> => {
        const now = new Date();
        const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventStartDay = event.start;

        if (!isValid(eventStartDay)) return { style: { display: 'none' } };

        const diff = differenceInDays(eventStartDay, startOfDayNow);
        let baseColor = settings.defaultColor;
        let isPast = false;

        if (isBefore(eventStartDay, startOfDayNow)) {
            isPast = true;
            baseColor = settings.pastColor; // Use pastColor from settings
        } else {
            if (diff < settings.urgentThreshold) baseColor = settings.urgentColor;
            else if (diff < settings.upcomingThreshold) baseColor = settings.upcomingColor;
        }

        // Basic fallback if color is invalid
        try { theme.palette.getContrastText(baseColor); } catch (e) { baseColor = theme.palette.grey[500]; }
        const contrastColor = theme.palette.getContrastText(baseColor);

        // Basic styles - padding handled by CustomEventComponent
        return {
            style: {
                backgroundColor: baseColor,
                color: contrastColor,
                borderRadius: '4px', // Simple border radius
                border: `1px solid ${alpha(contrastColor, 0.3)}`,
                opacity: isPast ? 0.7 : 1.0,
                padding: 0, // Let CustomEventComponent handle internal padding
                fontSize: '0.8em',
                cursor: 'pointer',
                // Minimal shadow or none
                boxShadow: isPast ? 'none' : `0 1px 2px ${alpha(theme.palette.common.black, 0.15)}`,
            },
        };
    }, [settings, theme]); // Depend on settings and theme

    // Calendar components memo (no changes)
    const calendarComponents = useMemo(() => ({
        toolbar: CustomToolbar,
        event: CustomEventComponent,
    }), []);

    // Event selection handler (no changes)
    const handleSelectEvent = useCallback((event: CalendarEvent) => { navigate(`/project/${event.resource.projectId}/issue/${event.resource.issueId}`); }, [navigate]);

    // Tooltip accessor (pass theme)
    const tooltipAccessor = useCallback((event: CalendarEvent): string => {
        const priorityDetails = getPriorityDetails(event.resource.priority, theme); // Pass theme
        const assigned = getUserName(event.resource.assignedMemberId);
        return `Issue: ${event.title.split(': ')[1]}\nProject: ${event.title.split(': ')[0]}\nPriority: ${priorityDetails.text}\nAssigned: ${assigned}\nDeadline: ${format(event.start, 'PPP')}`;
    }, [theme]); // Depend on theme

    // Setting config (minimal changes if any)
    const settingConfig: { label: string; threshold?: ThresholdKey; color: ColorKey; helpText?: string }[] = useMemo(() => [
        { label: "Urgent", threshold: "urgentThreshold", color: "urgentColor", helpText: "Due <" },
        { label: "Upcoming", threshold: "upcomingThreshold", color: "upcomingColor", helpText: "Due <" },
        { label: "Default", color: "defaultColor", helpText: "Future" },
        { label: "Past", color: "pastColor", helpText: "Past due" }, // Add past color setting display
    ], []);

    // --- Main Render ---
    return (
        // ***** CHANGE HERE *****
        // Removed height, bgcolor, color, paddingTop. Uses flex column layout internally.
        <Box sx={{ display: "flex", flexDirection: "column", width: '100%' }}>
            {/* Header Area */}
            {/* Use theme text color, adjust padding/margins */}
            <Box sx={{ px: { xs: 2, md: 3 }, py: 2, flexShrink: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: "600", color: theme.palette.text.primary }}>
                        Task Calendar
                    </Typography>
                    <Tooltip title={showSettings ? "Hide Settings" : "Show Color Settings"}>
                        <IconButton onClick={() => setShowSettings(!showSettings)} sx={{ color: theme.palette.text.secondary }}><Settings /></IconButton>
                    </Tooltip>
                </Stack>

                {/* Settings Panel */}
                {/* Use theme background/paper, standard elevation/borders */}
                {showSettings && (
                    <Paper
                        elevation={1} // Standard elevation
                        variant="outlined" // Or keep outlined if preferred
                        sx={{
                             p: { xs: 2, sm: 3 }, borderRadius: "8px", // Standard rounding
                             // Use theme paper background
                             backgroundColor: theme.palette.background.paper,
                             borderColor: theme.palette.divider, // Use theme divider
                             mb: 3, // Margin below settings
                         }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                           <Typography variant="h6" sx={{ fontWeight: "600", color: theme.palette.text.primary }}>Customize Task Colors</Typography>
                           <Tooltip title="Reset to Defaults">
                              <Button variant="outlined" size="small" onClick={resetSettings} startIcon={<Restore />} sx={{ color: theme.palette.text.secondary, borderColor: theme.palette.divider }}>Reset</Button>
                           </Tooltip>
                        </Stack>
                        <Grid container spacing={2.5}> {/* Adjust spacing */}
                            {settingConfig.map(({ label, threshold, color, helpText }) => (
                                <Grid item xs={12} sm={6} lg={3} key={label}>
                                    {/* Style setting items consistently */}
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.action.hover, 0.04), borderRadius: '6px', height: '100%' }}>
                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                            <Stack flexGrow={1}>
                                                 <Typography sx={{ fontWeight: "500", color: theme.palette.text.primary, fontSize: '0.9rem' }}>{label}:</Typography>
                                                 <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                      {helpText} {threshold ? settings[threshold] : ''} {threshold ? 'day(s)' : ''}
                                                 </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                {threshold && (
                                                    <TextField type="number" value={settings[threshold] ?? ''} onChange={(e) => handleSettingChange(threshold, e.target.value)}
                                                        sx={{ width: 60, '& .MuiInputBase-input': { textAlign: "center", padding: '8px 5px' } }}
                                                        variant="outlined" size="small" InputProps={{ inputProps: { min: 0, step: 1 } }} />
                                                )}
                                                <input type="color" value={settings[color] ?? '#ffffff'} onChange={(e) => handleSettingChange(color, e.target.value)}
                                                    style={{ width: 32, height: 32, border: `1px solid ${theme.palette.divider}`, borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }} />
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
            {/* ***** CHANGE HERE ***** */}
            {/* Give this Box a specific height, not flexGrow. The PARENT scrolls. */}
            {/* Using vh unit minus estimated header/toolbar height. Adjust as needed. */}
            {/* Or use a fixed pixel height like '800px' */}
            <Box sx={{
                // height: '800px', // Example fixed height
                height: 'calc(100vh - 220px)', // Example using vh minus estimated header/padding/toolbar
                minHeight: '500px', // Ensure a minimum height
                px: { xs: 1, md: 2 }, pb: 3, // Adjust padding
                // Styling overrides for react-big-calendar
                '& .rbc-calendar': {
                    // Use theme background/colors
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.divider}`,
                    // ** IMPORTANT: Set height to 100% of the parent Box **
                    height: "100% !important",
                },
                // Basic theme integration for other parts
                '& .rbc-header': { color: theme.palette.text.secondary, borderBottom: `1px solid ${theme.palette.divider}`, padding: '8px 0', fontWeight: 500, fontSize: '0.8rem', textTransform: 'uppercase' },
                '& .rbc-day-bg': { borderColor: theme.palette.divider },
                '& .rbc-today': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                '& .rbc-event': { padding: '0px !important' }, // Padding handled by CustomEventComponent
                '& .rbc-event.rbc-selected': { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText },
                '& .rbc-off-range-bg': { backgroundColor: alpha(theme.palette.action.disabledBackground, 0.5) },
                '& .rbc-time-header, & .rbc-time-gutter': { bgcolor: theme.palette.background.default, color: theme.palette.text.secondary, borderColor: theme.palette.divider },
                '& .rbc-time-slot': { borderColor: theme.palette.divider },
                '& .rbc-current-time-indicator': { backgroundColor: theme.palette.error.main },
                '& .rbc-show-more': { color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark } }
            }}>
                <Calendar<CalendarEvent>
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    allDayAccessor="allDay"
                    view={currentView}
                    onView={setCurrentView}
                    date={currentDate}
                    onNavigate={setCurrentDate}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    components={calendarComponents}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    // Style set via sx override on parent Box
                    // style={{ height: "100%" }} <-- redundant now
                    formats={{ // Keep simplified formats
                         monthHeaderFormat: 'MMMM yyyy',
                         dayHeaderFormat: (date, culture, loc) => loc ? loc.format(date, 'EEE dd MMM', culture) : '',
                         dayRangeHeaderFormat: ({ start, end }, culture, loc) => loc ? `${loc.format(start, 'MMM dd')} - ${loc.format(end, loc.format(start, 'MMM') === loc.format(end, 'MMM') ? 'dd' : 'MMM dd')}` : '',
                    }}
                    popup
                    selectable
                    tooltipAccessor={tooltipAccessor}
                    dayLayoutAlgorithm="no-overlap"
                />
            </Box>
        </Box>
    );
};

export default CustomCalendar;