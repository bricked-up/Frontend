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
<<<<<<< HEAD
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
=======
    // useMediaQuery, // Removed as isMobile wasn't used
    Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";
import InboxIcon from "@mui/icons-material/Inbox";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useNavigate } from "react-router-dom";
// Import the Issue type and the corrected mock data
import { Issue } from "../utils/types"; // Correct import for Issue type
import { mockActivityData } from "../utils/mock_Activity_Calendar_Data"; // Correct import for mock data
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780

// --- Constants ---
const FILTERS = [
    { value: "Unread", label: "Unread", icon: <InboxIcon fontSize="small" /> },
    { value: "@Mentions", label: "@Mentions", icon: <AlternateEmailIcon fontSize="small" /> },
    { value: "Tags", label: "Tags", icon: <LocalOfferIcon fontSize="small" /> },
];

const TRANSITION_DURATION = 300; // ms

// --- Helper Type ---
interface ActivityCardProps {
<<<<<<< HEAD
    task: TaskItem;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onNavigateToCalendar: (date: string) => void;
=======
    issue: Issue;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
    onNavigateToCalendar: (date: Date) => void;
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
}

// --- ActivityCard Component ---
const ActivityCard: React.FC<ActivityCardProps> = ({
<<<<<<< HEAD
    task,
=======
    issue,
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
    isExpanded,
    onToggleExpand,
    onNavigateToCalendar,
}) => {
    const theme = useTheme();

    const handleCardClick = () => {
<<<<<<< HEAD
        onToggleExpand(task.id);
=======
        onToggleExpand(issue.id);
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
    };

    const handleDueDateClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card expansion toggle
<<<<<<< HEAD
        onNavigateToCalendar(task.dueDate);
    };

    // Mock "unread" status for visual demonstration - CORRECTED IDs
    const isUnread = task.id === "1" || task.id === "3"; // Example logic using actual IDs
=======
        onNavigateToCalendar(issue.completed); // Pass the Date object
    };

    // Mock "unread" status for visual demonstration
    const isUnread = issue.id === 1 || issue.id === 3;

    // Format the date for display
    const formattedDueDate = issue.completed.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780

    return (
        <Grow in timeout={TRANSITION_DURATION}>
            <Card
                sx={{
<<<<<<< HEAD
                    backgroundColor: theme.palette.grey[900], // Slightly lighter than main bg
                    color: theme.palette.common.white,
                    borderRadius: 3, // Softer corners
                    mb: 2,
                    transition: `transform ${TRANSITION_DURATION}ms ease-in-out, box-shadow ${TRANSITION_DURATION}ms ease-in-out, border-left ${TRANSITION_DURATION}ms ease-in-out`, // Added border-left transition
=======
                    // Keeping specific card styling as requested
                    backgroundColor: theme.palette.grey[900],
                    color: theme.palette.common.white,
                    borderRadius: 3,
                    mb: 2,
                    transition: `transform ${TRANSITION_DURATION}ms ease-in-out, box-shadow ${TRANSITION_DURATION}ms ease-in-out, border-left ${TRANSITION_DURATION}ms ease-in-out`,
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                    borderLeft: isUnread ? `4px solid ${theme.palette.primary.main}` : `4px solid transparent`,
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 25px -5px ${theme.palette.primary.dark}`,
<<<<<<< HEAD
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
=======
                    },
                }}
            >
                <CardActionArea
                    onClick={handleCardClick}
                    aria-expanded={isExpanded}
                    aria-controls={`activity-details-${issue.id}`}
                    sx={{ p: 2 }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Stack spacing={0.5}>
                            <Typography variant="h6" fontWeight={600} component="div">
                                {issue.name}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton
                                size="small"
                                aria-label={isExpanded ? "Collapse issue details" : "Expand issue details"}
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
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
<<<<<<< HEAD

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
=======
                <Collapse in={isExpanded} timeout={TRANSITION_DURATION} unmountOnExit>
                    <Divider sx={{ borderColor: theme.palette.grey[700], mx: 2 }} />
                    <CardContent sx={{ pt: 2, px: 3, pb: 3 }}>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems={{ sm: 'flex-start' }}>
                                <Stack spacing={0.5} sx={{ flex: 1 }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Completed By
                                    </Typography>
                                    {/* FIX: Adjusted Chip styling for icon alignment */}
                                    <Chip
                                        icon={<CalendarTodayIcon sx={{ fontSize: '1rem' /* Optional: Adjust icon size */ }} />}
                                        label={formattedDueDate}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleDueDateClick}
                                        clickable
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                        sx={{
                                            cursor: 'pointer',
                                            color: theme.palette.warning.light,
                                            borderColor: theme.palette.warning.dark,
                                            backgroundColor: 'rgba(255, 183, 77, 0.1)',
<<<<<<< HEAD
=======
                                            height: 'auto', // Allow height to adjust naturally
                                            '& .MuiChip-label': { // Target the label specifically
                                                paddingTop: '3px', // Fine-tune vertical alignment if needed
                                                paddingBottom: '3px',
                                            },
                                            '& .MuiChip-icon': { // Target the icon specifically
                                                marginLeft: '8px', // Adjust spacing if needed
                                                marginRight: '-4px', // Adjust spacing if needed
                                                // Icons in MUI Chip are usually centered well by default with flex
                                            },
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 183, 77, 0.2)',
                                            }
                                        }}
                                    />
                                </Stack>
                            </Stack>
<<<<<<< HEAD

                            {/* Description */}
=======
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                            <Stack spacing={1}>
                                <Typography variant="overline" color="text.secondary">
                                    Description
                                </Typography>
                                <Paper
<<<<<<< HEAD
                                    elevation={0} // No shadow, just using for background/padding
                                    sx={{
                                        backgroundColor: theme.palette.grey[800], // Slightly different background
                                        borderRadius: 2,
                                        padding: 2,
                                        color: theme.palette.text.primary, // Brighter text for readability
=======
                                    elevation={0}
                                    sx={{
                                        backgroundColor: theme.palette.grey[800],
                                        borderRadius: 2,
                                        padding: 2,
                                        color: theme.palette.text.primary,
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                        lineHeight: 1.7,
                                        fontSize: '0.9rem',
                                    }}
                                >
<<<<<<< HEAD
                                    {task.description || <Typography variant="body2" fontStyle="italic" color="text.secondary">No description provided.</Typography>}
                                </Paper>
                            </Stack>
=======
                                    {issue.description || <Typography variant="body2" fontStyle="italic" color="text.secondary">No description provided.</Typography>}
                                </Paper>
                            </Stack>
                             <Stack direction="row" spacing={3}>
                                <Stack spacing={0.5}>
                                    <Typography variant="overline" color="text.secondary">Priority</Typography>
                                    <Chip label={issue.priority} size="small" />
                                </Stack>
                                <Stack spacing={0.5}>
                                    <Typography variant="overline" color="text.secondary">Cost</Typography>
                                    <Chip label={issue.cost || 0} size="small" />
                                </Stack>
                             </Stack>
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                        </Stack>
                    </CardContent>
                </Collapse>
            </Card>
        </Grow>
    );
};

<<<<<<< HEAD
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
=======
/**
 * The main component for the Activity Feed page.
 *
 * This component displays a filterable and searchable list of activities (issues).
 * Key features include:
 * - Displaying issues using the `ActivityCard` component.
 * - Filtering issues by predefined categories ("Unread", "@Mentions", "Tags").
 * - Searching issues by name or description using a text field.
 * - Allowing users to expand/collapse individual issue cards to view details.
 * - Navigating to the Calendar page when the due date is clicked.
 * - Using mock data (`mockActivityData`) as the current data source.
 *
 * @component
 * @example
 * // Usage in App.tsx routes:
 * <Route path="/activity" element={<Activity />} />
 *
 * @returns {JSX.Element} The Activity Feed page component.
 */
const Activity: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<string>(FILTERS[0].value);
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleToggleExpand = (id: number) => {
        setExpandedIssueId((prevId) => (prevId === id ? null : id));
    };

    const handleNavigateToCalendar = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        navigate(`/calendar?date=${dateString}`);
    };

    // Memoize filtered issues for performance
    const filteredIssues = useMemo(() => {
        // Explicitly type the array copy
        let issues: Issue[] = [...mockActivityData];

        // 1. Filter based on selectedFilter
        if (selectedFilter === "Unread") {
            // Compare numbers correctly
            issues = issues.filter(issue => issue.id === 1 || issue.id === 3);
        } else if (selectedFilter === "@Mentions") {
             issues = issues.filter(issue => issue.description?.includes('@'));
        } else if (selectedFilter === "Tags") {
             // Compare numbers correctly
             issues = issues.filter(issue => issue.id === 2);
        }

        // 2. Filter based on search query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            issues = issues.filter(
                (issue) => // issue should be correctly typed now
                    issue.name.toLowerCase().includes(lowerCaseQuery) ||
                    (issue.description && issue.description.toLowerCase().includes(lowerCaseQuery))
            );
        }

        return issues;
    }, [selectedFilter, searchQuery, mockActivityData]); // Keep mockActivityData dependency
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780


    return (
        <Box
            sx={{
<<<<<<< HEAD
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
=======
                // FIX: Removed background overrides to inherit from Layout/Theme
                // backgroundColor: theme.palette.grey[900],
                // backgroundImage: 'radial-gradient(...)',
                minHeight: "calc(100vh - 64px)", // Keep minHeight calculation
                paddingTop: "64px", // Keep padding for header space
                display: "flex",
                justifyContent: "center",
                p: { xs: 2, sm: 3, md: 4 }, // Keep responsive padding
                boxSizing: 'border-box',
                // Ensure this Box takes up the space provided by Layout's Outlet container
                width: '100%',
                height: '100%', // Or adjust based on Layout's structure
            }}
        >
            <Stack
                spacing={4}
                sx={{
                    width: "100%",
                    maxWidth: "900px", // Keep max width for content centering
                }}
            >
                 <Typography variant="h4" fontWeight={700} color="common.white"  /* Changed to text.primary for theme consistency */ sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                   Activity Feed
                </Typography>
                {/* Filter + Search Controls - Keeping specific styling as requested */}
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                <Paper
                     elevation={3}
                     sx={{
                       display: "flex",
<<<<<<< HEAD
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
=======
                       flexDirection: { xs: 'column', md: 'row' },
                       justifyContent: "space-between",
                       alignItems: { md: "center" },
                       gap: 2,
                       p: 2.5,
                       backgroundColor: theme.palette.background.paper, // Use theme's paper background
                       borderRadius: 3,
                       position: 'sticky',
                       top: 64, // Adjust if Layout's Topbar height is different
                       zIndex: 10,
                     }}
                >
                     <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }} >
                         <FilterListIcon sx={{ color: theme.palette.text.secondary, display: { xs: 'none', sm: 'block' }}}/>
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                        <ToggleButtonGroup
                            value={selectedFilter}
                            exclusive
                            onChange={(e, newFilter) => {
                                if (newFilter !== null) {
                                    setSelectedFilter(newFilter);
<<<<<<< HEAD
                                    setExpandedTaskId(null); // Collapse all cards on filter change
=======
                                    setExpandedIssueId(null);
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                }
                            }}
                            aria-label="Activity Filters"
                            sx={{
<<<<<<< HEAD
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
=======
                                flexWrap: 'wrap',
                                gap: 1,
                                '.MuiToggleButtonGroup-grouped': {
                                    border: `1px solid ${theme.palette.divider}`, // Use theme divider color
                                    borderRadius: '8px !important',
                                    padding: '6px 14px',
                                    color: theme.palette.text.secondary, // Use theme text secondary
                                    backgroundColor: theme.palette.action.hover, // Use subtle theme background
                                    textTransform: "none",
                                    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                         backgroundColor: theme.palette.action.selected, // Use theme selected action background
                                         color: theme.palette.text.primary, // Use theme primary text
                                         borderColor: theme.palette.divider,
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        fontWeight: 600,
<<<<<<< HEAD
                                        borderColor: theme.palette.primary.dark, // Darker border when selected
=======
                                        borderColor: theme.palette.primary.dark,
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            borderColor: theme.palette.primary.dark,
                                        },
                                    },
<<<<<<< HEAD
                                     // Add icons
=======
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                    '& .MuiSvgIcon-root': {
                                        marginRight: theme.spacing(0.8),
                                        fontSize: '1rem',
                                    },
                                },
<<<<<<< HEAD
                                // Remove visual separators between buttons (handled by gap now)
                                // '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                                //     borderLeft: 'none',
                                //     marginLeft: theme.spacing(0.5), // Adjust spacing if needed
                                // },
                                // '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
                                //      marginRight: theme.spacing(0.5),
                                // },
=======
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
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
<<<<<<< HEAD

                    {/* Search Field */}
=======
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
<<<<<<< HEAD
                                    <SearchIcon sx={{ color: theme.palette.grey[400] }} />
                                </InputAdornment>
                            ),
                             endAdornment: searchQuery && ( // Show clear button only when there's input
=======
                                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                             endAdornment: searchQuery && (
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="clear search"
                                    onClick={() => setSearchQuery("")}
                                    edge="end"
                                    size="small"
<<<<<<< HEAD
                                    sx={{ color: theme.palette.grey[400] }}
=======
                                    sx={{ color: theme.palette.text.secondary }}
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 5.354a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                    </svg>
                                </IconButton>
                                </InputAdornment>
                             ),
                            sx: {
<<<<<<< HEAD
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
=======
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.default, // Use theme default background
                                color: theme.palette.text.primary, // Use theme primary text
                                transition: 'border-color 0.2s ease',
                                '& fieldset': {
                                    borderColor: theme.palette.divider, // Use theme divider
                                    transition: 'border-color 0.2s ease',
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.light,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: '1px',
                                },
                                'input::placeholder': {
                                    color: theme.palette.text.disabled, // Use theme disabled text for placeholder
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                    opacity: 1,
                                },
                            }
                        }}
                        sx={{
<<<<<<< HEAD
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
=======
                            minWidth: { xs: '100%', md: 300 },
                        }}
                    />
                </Paper>
                {/* Issue List Area */}
                {/* Adjust maxHeight calculation if needed */}
                <Box sx={{ overflowY: "auto", maxHeight: 'calc(100vh - 64px - 100px - 32px)', pr: 0.5 }}>
                    {filteredIssues.length > 0 ? (
                         <Stack spacing={0}>
                            {/* Explicitly type issue in map callback */}
                            {filteredIssues.map((issue: Issue) => (
                                <ActivityCard
                                    key={issue.id}
                                    issue={issue} // Should now be correctly typed
                                    isExpanded={expandedIssueId === issue.id} // Comparison should be correct (number === number)
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
                                    onToggleExpand={handleToggleExpand}
                                    onNavigateToCalendar={handleNavigateToCalendar}
                                />
                            ))}
                         </Stack>
                    ) : (
<<<<<<< HEAD
                         // Empty State Message
                         <Fade in timeout={500}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8, color: theme.palette.grey[500]}}>
=======
                         <Fade in timeout={500}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8, color: theme.palette.text.secondary /* Use theme color */}}>
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
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

<<<<<<< HEAD
export default Activity;
=======
export default Activity;
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
