import React, { useState, useMemo } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    Card,
    CardContent,
    CardActionArea,
    Collapse,
    Stack,
    Chip,
    Divider,
    Fade,
    Grow,
    useTheme,
    useMediaQuery,
    Paper, // Added for better background control
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList"; // For Filter Toggle Group Title
import InboxIcon from "@mui/icons-material/Inbox"; // Icon for Unread
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"; // Icon for @Mentions
import LocalOfferIcon from "@mui/icons-material/LocalOffer"; // Icon for Tags
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // For empty state

import { useNavigate } from "react-router-dom";
// Ensure this path is correct for your project structure
import { mockActivityData, TaskItem } from "../utils/mock_Activity_Calendar_Data";

// --- Constants ---
const FILTERS = [
    { value: "Unread", label: "Unread", icon: <InboxIcon fontSize="small" /> },
    { value: "@Mentions", label: "@Mentions", icon: <AlternateEmailIcon fontSize="small" /> },
    { value: "Tags", label: "Tags", icon: <LocalOfferIcon fontSize="small" /> },
];

const TRANSITION_DURATION = 300; // ms

// --- Helper Type ---
interface ActivityCardProps {
    task: TaskItem;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onNavigateToCalendar: (date: string) => void;
}

// --- ActivityCard Component ---
const ActivityCard: React.FC<ActivityCardProps> = ({
    task,
    isExpanded,
    onToggleExpand,
    onNavigateToCalendar,
}) => {
    const theme = useTheme();

    const handleCardClick = () => {
        onToggleExpand(task.id);
    };

    const handleDueDateClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card expansion toggle
        onNavigateToCalendar(task.dueDate);
    };

    // Mock "unread" status for visual demonstration - CORRECTED IDs
    const isUnread = task.id === "1" || task.id === "3"; // Example logic using actual IDs

    return (
        <Grow in timeout={TRANSITION_DURATION}>
            <Card
                sx={{
                    backgroundColor: theme.palette.grey[900], // Slightly lighter than main bg
                    color: theme.palette.common.white,
                    borderRadius: 3, // Softer corners
                    mb: 2,
                    transition: `transform ${TRANSITION_DURATION}ms ease-in-out, box-shadow ${TRANSITION_DURATION}ms ease-in-out, border-left ${TRANSITION_DURATION}ms ease-in-out`, // Added border-left transition
                    borderLeft: isUnread ? `4px solid ${theme.palette.primary.main}` : `4px solid transparent`,
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 25px -5px ${theme.palette.primary.dark}`,
                        // Optional: Dim the border slightly on hover if unread
                        // borderLeft: isUnread ? `4px solid ${theme.palette.primary.dark}` : `4px solid transparent`,
                    },
                }}
            >
                {/* Make the main area clickable for expansion */}
                <CardActionArea
                    onClick={handleCardClick}
                    aria-expanded={isExpanded}
                    aria-controls={`activity-details-${task.id}`}
                    sx={{ p: 2 }} // Padding for the clickable area
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        {/* Task Name and Basic Info */}
                        <Stack spacing={0.5}>
                            <Typography variant="h6" fontWeight={600} component="div">
                                {task.taskName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <WorkIcon fontSize="inherit" sx={{ opacity: 0.7 }} /> {task.projectName}
                            </Typography>
                        </Stack>

                        {/* Status Indicator (optional) & Expand Icon */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {/* Optional: If you add status later
                            <Chip size="small" label="In Progress" color="secondary" sx={{ height: 'auto', '.MuiChip-label': { py: 0.2 } }}/>
                            */}
                            <IconButton
                                size="small"
                                aria-label={isExpanded ? "Collapse task details" : "Expand task details"}
                                sx={{
                                    color: theme.palette.grey[400],
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: theme.transitions.create('transform', {
                                        duration: theme.transitions.duration.short,
                                    }),
                                }}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </CardActionArea>

                {/* Collapsible Details Section */}
                <Collapse in={isExpanded} timeout={TRANSITION_DURATION} unmountOnExit>
                    <Divider sx={{ borderColor: theme.palette.grey[700], mx: 2 }} />
                    <CardContent sx={{ pt: 2, px: 3, pb: 3 }}> {/* More padding for content */}
                        <Stack spacing={3}> {/* Increased spacing between sections */}
                            {/* Row with Team, Project, Due Date */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems={{ sm: 'flex-start' }}>
                                {/* Team */}
                                <Stack spacing={0.5} sx={{ flex: 1 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Team
                                    </Typography>
                                    <Chip
                                        icon={<GroupIcon />}
                                        label={task.teamName}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            color: theme.palette.info.light, // Use theme colors
                                            borderColor: theme.palette.info.dark,
                                            backgroundColor: 'rgba(100, 181, 246, 0.1)', // Subtle background
                                        }}
                                    />
                                </Stack>

                                {/* Due Date */}
                                <Stack spacing={0.5} sx={{ flex: 1 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Due Date
                                    </Typography>
                                    <Chip
                                        icon={<CalendarTodayIcon />}
                                        label={task.dueDate} // Assuming dueDate is a formatted string
                                        variant="outlined"
                                        size="small"
                                        onClick={handleDueDateClick} // Use specific handler
                                        clickable // Make it visually indicate clickability
                                        sx={{
                                            cursor: 'pointer',
                                            color: theme.palette.warning.light,
                                            borderColor: theme.palette.warning.dark,
                                            backgroundColor: 'rgba(255, 183, 77, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 183, 77, 0.2)',
                                            }
                                        }}
                                    />
                                </Stack>
                            </Stack>

                            {/* Description */}
                            <Stack spacing={1}>
                                <Typography variant="overline" color="text.secondary">
                                    Description
                                </Typography>
                                <Paper
                                    elevation={0} // No shadow, just using for background/padding
                                    sx={{
                                        backgroundColor: theme.palette.grey[800], // Slightly different background
                                        borderRadius: 2,
                                        padding: 2,
                                        color: theme.palette.text.primary, // Brighter text for readability
                                        lineHeight: 1.7,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {task.description || <Typography variant="body2" fontStyle="italic" color="text.secondary">No description provided.</Typography>}
                                </Paper>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Collapse>
            </Card>
        </Grow>
    );
};

// --- Main Activity Component ---
const Activity: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<string>(FILTERS[0].value); // Default to first filter "Unread"
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleToggleExpand = (id: string) => {
        setExpandedTaskId((prevId) => (prevId === id ? null : id));
    };

    const handleNavigateToCalendar = (date: string) => {
        navigate(`/calendar?date=${date}`);
    };

    // Memoize filtered tasks for performance
    const filteredTasks = useMemo(() => {
        // Start with the full list from mock data
        let tasks = [...mockActivityData]; // Create a copy to avoid modifying the original

        // 1. Filter based on selectedFilter
        // NOTE: This uses placeholder logic based on IDs or simple content checks.
        // Adapt this if your data has actual flags for 'unread', 'mentions', or 'tags'.
        if (selectedFilter === "Unread") {
            // Corrected IDs based on the provided mock data: "1" and "3"
            tasks = tasks.filter(task => task.id === "1" || task.id === "3");
        } else if (selectedFilter === "@Mentions") {
            // Filter based on description containing '@'.
            // Add '@' to descriptions in mock data to test this. Example: task '4' description.
             tasks = tasks.filter(task => task.description?.includes('@')); // This will likely be empty with current data unless you add '@'
        } else if (selectedFilter === "Tags") {
             // Corrected ID based on the provided mock data: "2"
             // This assumes task "2" represents having tags for demo purposes.
             // You might have a task.tags array in real data.
             tasks = tasks.filter(task => task.id === "2");
        }
        // If no specific filter is selected (or logic doesn't apply), `tasks` remains the full list up to this point.

        // 2. Filter based on search query (applied AFTER the category filter)
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            // Filter the result of the *previous* filter step
            tasks = tasks.filter(
                (task) =>
                    task.taskName.toLowerCase().includes(lowerCaseQuery) ||
                    task.projectName.toLowerCase().includes(lowerCaseQuery) ||
                    task.teamName.toLowerCase().includes(lowerCaseQuery) ||
                    // Ensure description exists before trying to search it
                    (task.description && task.description.toLowerCase().includes(lowerCaseQuery))
            );
        }

        return tasks;
     // Include mockActivityData in dependencies in case it could ever change (e.g., fetched data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockActivityData, selectedFilter, searchQuery]);


    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)", // Use minHeight to allow content growth
                paddingTop: "64px", // Assuming fixed header height
                backgroundColor: theme.palette.grey[900], // Dark background
                 backgroundImage: 'radial-gradient(circle at top left, rgba(50, 50, 90, 0.3), transparent 40%), radial-gradient(circle at bottom right, rgba(70, 30, 50, 0.2), transparent 50%)', // Subtle gradient background
                display: "flex",
                justifyContent: "center",
                p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                boxSizing: 'border-box', // Include padding in height calculation
            }}
        >
            <Stack // Use Stack for vertical layout of controls and list
                spacing={4} // Spacing between control bar and task list
                sx={{
                    width: "100%",
                    maxWidth: "900px", // Max width for content
                }}
            >
                 {/* Header */}
                <Typography variant="h4" fontWeight={700} color="common.white" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                   Activity Feed
                </Typography>

                {/* Filter + Search Controls */}
                <Paper
                     elevation={3}
                     sx={{
                       display: "flex",
                       flexDirection: { xs: 'column', md: 'row' }, // Stack on small, row on medium+
                       justifyContent: "space-between",
                       alignItems: { md: "center" },
                       gap: 2,
                       p: 2.5, // More padding inside the control bar
                       backgroundColor: theme.palette.grey[800], // Slightly different background for controls
                       borderRadius: 3, // Consistent rounding
                       position: 'sticky', // Make controls sticky
                       top: 64, // Stick below the assumed header height
                       zIndex: 10, // Ensure it stays above scrolling content
                     }}
                >
                    {/* Filter Toggle Group */}
                     <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 /* Allow wrapping on small screens */}} >
                         <FilterListIcon sx={{ color: theme.palette.grey[400], display: { xs: 'none', sm: 'block' } /* Hide icon on xs */}}/>
                        <ToggleButtonGroup
                            value={selectedFilter}
                            exclusive
                            onChange={(e, newFilter) => {
                                if (newFilter !== null) {
                                    setSelectedFilter(newFilter);
                                    setExpandedTaskId(null); // Collapse all cards on filter change
                                }
                            }}
                            aria-label="Activity Filters"
                            sx={{
                                // backgroundColor: theme.palette.grey[700], // Darker background for the group itself
                                // borderRadius: 2,
                                flexWrap: 'wrap', // Allow buttons to wrap
                                gap: 1, // Gap between wrapped buttons

                                '.MuiToggleButtonGroup-grouped': { // Target individual buttons
                                    border: `1px solid ${theme.palette.grey[600]}`, // Subtle border
                                    borderRadius: '8px !important', // Apply consistent border radius, !important might be needed
                                    padding: '6px 14px',
                                   // mx: 0.5, // Add small horizontal margin between buttons
                                    color: theme.palette.grey[300],
                                    backgroundColor: theme.palette.grey[700],
                                    textTransform: "none",
                                    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                         backgroundColor: theme.palette.grey[600],
                                         color: theme.palette.common.white,
                                         borderColor: theme.palette.grey[500],
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        fontWeight: 600,
                                        borderColor: theme.palette.primary.dark, // Darker border when selected
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            borderColor: theme.palette.primary.dark,
                                        },
                                    },
                                     // Add icons
                                    '& .MuiSvgIcon-root': {
                                        marginRight: theme.spacing(0.8),
                                        fontSize: '1rem',
                                    },
                                },
                                // Remove visual separators between buttons (handled by gap now)
                                // '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                                //     borderLeft: 'none',
                                //     marginLeft: theme.spacing(0.5), // Adjust spacing if needed
                                // },
                                // '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
                                //      marginRight: theme.spacing(0.5),
                                // },
                            }}
                        >
                            {FILTERS.map((filter) => (
                                <ToggleButton key={filter.value} value={filter.value} aria-label={filter.label}>
                                    {filter.icon}
                                    {filter.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Stack>

                    {/* Search Field */}
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: theme.palette.grey[400] }} />
                                </InputAdornment>
                            ),
                             endAdornment: searchQuery && ( // Show clear button only when there's input
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="clear search"
                                    onClick={() => setSearchQuery("")}
                                    edge="end"
                                    size="small"
                                    sx={{ color: theme.palette.grey[400] }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 5.354a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                    </svg>
                                </IconButton>
                                </InputAdornment>
                             ),
                            sx: {
                                borderRadius: 2, // Consistent rounding
                                backgroundColor: theme.palette.grey[700], // Match toggle group background
                                color: theme.palette.common.white,
                                transition: 'border-color 0.2s ease',
                                '& fieldset': {
                                    borderColor: theme.palette.grey[600], // Subtle border
                                    transition: 'border-color 0.2s ease',
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.light, // Border on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main, // Border on focus
                                    borderWidth: '1px',
                                },
                                // Style placeholder
                                'input::placeholder': {
                                    color: theme.palette.grey[500],
                                    opacity: 1,
                                },
                            }
                        }}
                        sx={{
                            minWidth: { xs: '100%', md: 300 }, // Full width on small, fixed on medium+
                        }}
                    />
                </Paper>

                {/* Task List Area */}
                {/* Adjust maxHeight calculation if needed based on your actual sticky header/controls height */}
                <Box sx={{ overflowY: "auto", maxHeight: 'calc(100vh - 64px - 100px - 32px)', /* vh - header - controls - stack_spacing */ pr: 0.5 /* Padding for scrollbar space */ }}>
                    {filteredTasks.length > 0 ? (
                         <Stack spacing={0}> {/* No extra space needed, handled by Card margin */}
                            {filteredTasks.map((task) => (
                                <ActivityCard
                                    key={task.id}
                                    task={task}
                                    isExpanded={expandedTaskId === task.id}
                                    onToggleExpand={handleToggleExpand}
                                    onNavigateToCalendar={handleNavigateToCalendar}
                                />
                            ))}
                         </Stack>
                    ) : (
                         // Empty State Message
                         <Fade in timeout={500}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8, color: theme.palette.grey[500]}}>
                                <ErrorOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" >
                                    No activities found
                                </Typography>
                                <Typography variant="body2" >
                                    Try adjusting your search or filters.
                                </Typography>
                            </Box>
                         </Fade>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default Activity;