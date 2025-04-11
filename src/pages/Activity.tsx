import React, { useState, useMemo, useCallback } from "react";
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
    Paper,
    Tooltip,
    CircularProgress, // Added for potential loading states
    Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Removed ExpandLessIcon as it's not used
import WorkIcon from "@mui/icons-material/WorkOutline"; // Using Outline variant for consistency
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined"; // Using Outline variant
import FilterListIcon from "@mui/icons-material/FilterList";
import InboxIcon from "@mui/icons-material/InboxOutlined"; // Using Outline variant
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined"; // Using Outline variant
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for Cost
import ClearIcon from '@mui/icons-material/Clear'; // Icon for clearing search

import { useNavigate } from "react-router-dom";
import { format, parseISO, isValid } from 'date-fns'; // Added isValid for robust date checking

// --- Corrected Import Statement ---
// Import the actual exported names and types from the file
import {
    mockIssues,      // Use mockIssues
    MockIssue,       // Use MockIssue type
    mockUsers,       // Need users for names
    getProjectName,  // Use helper function
    MockUser         // Import MockUser type for clarity in getUserName
} from "../utils/mock_Activity_Calendar_Data"; // Adjusted path assuming it's relative

// --- Constants ---
// Added 'All' filter as a default starting point
const FILTERS = [
    { value: "All", label: "All Activities", icon: <InboxIcon fontSize="small" /> },
    { value: "High Priority", label: "High Priority", icon: <PriorityHighIcon fontSize="small" /> },
    { value: "Due Soon", label: "Due Soon", icon: <CalendarTodayIcon fontSize="small" /> },
    // Placeholder filters - require actual data fields if implemented fully
    // { value: "Unread", label: "Unread", icon: <InboxIcon fontSize="small" /> },
    // { value: "@Mentions", label: "@Mentions", icon: <AlternateEmailIcon fontSize="small" /> },
    // { value: "Tags", label: "Tags", icon: <LocalOfferIcon fontSize="small" /> },
];

const TRANSITION_DURATION = 350; // Slightly increased duration for smoother feel
const STAGGER_DELAY_INCREMENT = 50; // Delay for staggering card animations

// --- Helper Functions ---

// Get user name with improved handling for unknown IDs
const getUserName = (userId?: number): string => {
    if (userId === undefined || userId === null) return "Unassigned";
    const user: MockUser | undefined = mockUsers.find(u => u.id === userId);
    return user ? user.name : `Unknown User (ID: ${userId})`;
};

// Get priority text and associated color/icon (more robust)
const getPriorityDetails = (priority: 1 | 2 | 3): { text: string; color: "error" | "warning" | "success"; icon: React.ReactElement } => {
    switch (priority) {
        case 1: return { text: "High", color: "error", icon: <PriorityHighIcon /> };
        case 2: return { text: "Medium", color: "warning", icon: <PriorityHighIcon style={{ opacity: 0.7 }}/> }; // Example: slightly different icon style
        case 3: return { text: "Low", color: "success", icon: <PriorityHighIcon style={{ opacity: 0.5 }}/> };
        default: return { text: "Unknown", color: "success", icon: <PriorityHighIcon /> }; // Default to 'success' color visually
    }
};

// Format deadline robustly
const formatDeadline = (deadlineString: string): string => {
    try {
        // Append time and timezone offset to ensure correct parsing regardless of local timezone
        // Using 'Z' for UTC, assuming deadlines are stored consistently. Adjust if needed.
        const deadlineDate = parseISO(deadlineString + 'T00:00:00Z');
        if (isValid(deadlineDate)) {
            // Example format: Apr 10, 2025
            return format(deadlineDate, 'MMM dd, yyyy');
        }
    } catch (e) {
        console.error("Error parsing date:", deadlineString, e);
    }
    // Fallback if parsing fails or date is invalid
    return deadlineString || "No Deadline";
};

// --- Enhanced ActivityCard Props ---
interface ActivityCardProps {
    issue: MockIssue;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
    onNavigateToCalendar: (date: string) => void;
    onNavigateToIssue: (projectId: number, issueId: number) => void;
    index: number; // Added index for staggered animation delay
}

// --- Enhanced ActivityCard Component ---
const ActivityCard: React.FC<ActivityCardProps> = ({
    issue,
    isExpanded,
    onToggleExpand,
    onNavigateToCalendar,
    onNavigateToIssue,
    index // Receive index prop
}) => {
    const theme = useTheme();
    const projectName = getProjectName(issue.projectId);
    const priorityDetails = getPriorityDetails(issue.priority);
    const formattedDeadline = formatDeadline(issue.deadline);
    const assignedUserName = getUserName(issue.assignedMemberId);

    const handleCardClick = useCallback(() => {
        // Navigate directly to issue detail on click, expand handled separately by icon
         onNavigateToIssue(issue.projectId, issue.id);
        // If you prefer expand on click, uncomment below and comment above
        // onToggleExpand(issue.id);
    }, [onNavigateToIssue, issue.projectId, issue.id /*, onToggleExpand */]); // Added dependencies

    const handleExpandClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation when clicking expand icon
        onToggleExpand(issue.id);
    }, [onToggleExpand, issue.id]); // Added dependencies

    const handleDueDateClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation
        onNavigateToCalendar(issue.deadline);
    }, [onNavigateToCalendar, issue.deadline]); // Added dependencies

    // Simple unread simulation (replace with actual logic if available)
    const isUnread = (issue.id % 5 === 1); // Example: Mark every 5th item starting from id 1 as unread

    return (
        // Staggered Grow animation based on index
        <Grow in timeout={TRANSITION_DURATION} style={{ transitionDelay: `${index * STAGGER_DELAY_INCREMENT}ms` }}>
            <Card
                elevation={isExpanded ? 8 : 2} // Increase elevation when expanded
                sx={{
                    // Use subtle background gradient based on priority
                    background: `linear-gradient(to right, ${theme.palette.grey[900]}, ${
                        isExpanded
                        ? theme.palette.grey[800] // Darker when expanded
                        : theme.palette.grey[800] // Slightly lighter base
                    })`,
                    color: theme.palette.common.white,
                    borderRadius: 3,
                    mb: 2,
                    transition: theme.transitions.create(['transform', 'box-shadow', 'border-left', 'background'], {
                        duration: `${TRANSITION_DURATION}ms`,
                        easing: theme.transitions.easing.easeInOut, // Smoother easing
                    }),
                    borderLeft: isUnread ? `4px solid ${theme.palette.primary.main}` : `4px solid transparent`,
                    '&:hover': {
                        transform: 'translateY(-4px) scale(1.01)', // Slightly more pronounced hover effect
                        boxShadow: `0 10px 30px -8px ${theme.palette.primary.dark}`, // Enhanced shadow
                        borderLeftColor: isUnread ? theme.palette.primary.light : theme.palette.grey[700] // Highlight border on hover
                    },
                }}
            >
                {/* Main clickable area */}
                <CardActionArea
                    onClick={handleCardClick}
                    aria-expanded={isExpanded} // Still useful for accessibility even if expand is separate button
                    aria-controls={`activity-details-${issue.id}`}
                    sx={{ p: 2.5 }} // Slightly more padding
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        {/* Left side: Issue Name & Project */}
                        <Stack spacing={0.8} flexGrow={1} minWidth={0}> {/* Allow shrinking */}
                            <Tooltip title={issue.name} placement="top-start">
                                <Typography variant="h6" fontWeight={600} component="div" noWrap> {/* Prevent long names from breaking layout */}
                                    {issue.name}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={`Project: ${projectName}`} placement="bottom-start">
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.8, opacity: 0.8 }}>
                                <WorkIcon fontSize="inherit" /> {projectName}
                            </Typography>
                            </Tooltip>
                        </Stack>

                        {/* Right side: Priority & Expand */}
                        <Stack direction="row" alignItems="center" spacing={1.5} flexShrink={0}> {/* Prevent shrinking */}
                            <Tooltip title={`Priority: ${priorityDetails.text}`}>
                                <Chip
                                    icon={priorityDetails.icon}
                                    label={priorityDetails.text}
                                    size="small"
                                    color={priorityDetails.color}
                                    variant="filled" // Use filled for better contrast
                                    sx={{
                                        height: 'auto',
                                        '.MuiChip-label': { py: 0.3, px: 1 },
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        cursor: 'default' // Indicate it's not clickable
                                    }}
                                />
                             </Tooltip>
                            <Tooltip title={isExpanded ? "Collapse details" : "Expand details"}>
                            <IconButton
                                size="small"
                                onClick={handleExpandClick} // Use specific handler
                                aria-label={isExpanded ? "Collapse task details" : "Expand task details"}
                                aria-controls={`activity-details-${issue.id}`} // Link to the collapse section
                                aria-expanded={isExpanded} // Explicitly set aria-expanded
                                sx={{
                                    color: theme.palette.grey[400],
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: theme.transitions.create('transform', {
                                        duration: theme.transitions.duration.short,
                                    }),
                                    '&:hover': { // Subtle hover for expand icon
                                        backgroundColor: theme.palette.action.hover,
                                        color: theme.palette.common.white,
                                    }
                                }}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardActionArea>

                {/* Collapsible Details Section */}
                <Collapse in={isExpanded} timeout={TRANSITION_DURATION} unmountOnExit>
                    {/* Added Divider with softer color */}
                    <Divider sx={{ borderColor: theme.palette.grey[700], mx: 2.5 }} />
                    <CardContent sx={{ pt: 2, px: 3, pb: 3 }}>
                        <Stack spacing={3}> {/* Increased spacing in details */}
                            {/* Row for Assigned, Deadline, Cost */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 3 }} justifyContent="space-between">
                                {/* Assigned To */}
                                <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <PersonOutlineIcon fontSize="inherit" /> Assigned To
                                    </Typography>
                                    <Chip
                                        label={assignedUserName}
                                        variant="outlined"
                                        size="small"
                                        // Consistent styling using theme colors
                                        sx={{ color: theme.palette.info.light, borderColor: theme.palette.info.dark, backgroundColor: 'rgba(100, 181, 246, 0.1)' }}
                                    />
                                </Stack>

                                {/* Deadline */}
                                <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                                     <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarTodayIcon fontSize="inherit"/> Deadline
                                    </Typography>
                                    <Tooltip title="Go to this date in calendar">
                                        <Chip
                                            label={formattedDeadline}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleDueDateClick}
                                            clickable
                                            // Consistent styling using theme colors
                                            sx={{ cursor: 'pointer', color: theme.palette.warning.light, borderColor: theme.palette.warning.dark, backgroundColor: 'rgba(255, 183, 77, 0.1)', '&:hover': { backgroundColor: 'rgba(255, 183, 77, 0.2)'} }}
                                        />
                                    </Tooltip>
                                </Stack>

                                {/* Estimated Cost - Conditionally rendered */}
                                {issue.cost !== undefined && issue.cost !== null && (
                                    <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AttachMoneyIcon fontSize="inherit"/> Estimated Cost
                                        </Typography>
                                        <Chip
                                            label={`$${issue.cost.toLocaleString()}`} // Format cost
                                            variant="outlined"
                                            size="small"
                                            // Consistent styling using theme colors
                                            sx={{ color: theme.palette.success.light, borderColor: theme.palette.success.dark, backgroundColor: 'rgba(102, 187, 106, 0.1)' }}
                                        />
                                    </Stack>
                                )}
                            </Stack>

                            {/* Description - Conditionally rendered */}
                            {issue.description && (
                                <Stack spacing={1}>
                                    <Typography variant="overline" color="text.secondary">
                                        Description
                                    </Typography>
                                    {/* Use Paper for better visual separation and padding */}
                                    <Paper
                                        elevation={0}
                                        variant="outlined" // Use outlined variant for subtle border
                                        sx={{
                                            backgroundColor: theme.palette.grey[800],
                                            borderColor: theme.palette.grey[700], // Match divider color
                                            borderRadius: 2,
                                            padding: 2,
                                            color: theme.palette.text.primary,
                                            lineHeight: 1.6, // Improved readability
                                            fontSize: '0.9rem',
                                             whiteSpace: 'pre-wrap', // Preserve whitespace/newlines
                                        }}
                                    >
                                        {issue.description}
                                    </Paper>
                                </Stack>
                            )}
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
    // Default to 'All' filter
    const [selectedFilter, setSelectedFilter] = useState<string>(FILTERS[0].value);
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
    // Add a loading state example (set to false for mock data)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const theme = useTheme();

    // Memoize handlers to prevent unnecessary re-renders of cards
    const handleToggleExpand = useCallback((id: number) => {
        setExpandedIssueId((prevId) => (prevId === id ? null : id));
    }, []); // No dependencies needed if setExpandedIssueId is stable

    const handleNavigateToCalendar = useCallback((date: string) => {
        // Encode date component for URL safety
        navigate(`/calendar?date=${encodeURIComponent(date)}`);
    }, [navigate]); // Depends on navigate

    const handleNavigateToIssue = useCallback((projectId: number, issueId: number) => {
        navigate(`/project/${projectId}/issue/${issueId}`);
    }, [navigate]); // Depends on navigate

    const handleFilterChange = useCallback((event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
        if (newFilter !== null) {
            setSelectedFilter(newFilter);
            setExpandedIssueId(null); // Collapse any open card when filter changes
             // Optionally reset search query on filter change:
             // setSearchQuery("");
        }
    }, []); // No dependencies needed

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setExpandedIssueId(null); // Collapse any open card when search changes
    }, []); // No dependencies needed

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setExpandedIssueId(null);
    }, []); // No dependencies needed

    // Enhanced Filtering and Searching Logic
    const filteredIssues = useMemo(() => {
        let issues = [...mockIssues];

        // --- Apply Selected Filter ---
        // Replace placeholder logic with actual filtering based on MockIssue fields
        const now = new Date();
        const soonDate = new Date();
        soonDate.setDate(now.getDate() + 3); // Define "soon" as within the next 3 days

        if (selectedFilter === "High Priority") {
            issues = issues.filter(issue => issue.priority === 1);
        } else if (selectedFilter === "Due Soon") {
             issues = issues.filter(issue => {
                try {
                    const deadline = parseISO(issue.deadline + 'T00:00:00Z');
                    return isValid(deadline) && deadline >= now && deadline <= soonDate;
                } catch {
                    return false;
                }
            });
        }
        // Add other filters here ('All' does nothing)
        // else if (selectedFilter === "Unread") { ... } // Requires 'isUnread' field
        // else if (selectedFilter === "@Mentions") { ... } // Requires parsing description or dedicated field
        // else if (selectedFilter === "Tags") { ... } // Requires 'tags' field

        // --- Apply Search Query ---
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase().trim();
            if (lowerCaseQuery) { // Only filter if query is not just whitespace
                issues = issues.filter(issue => {
                    const projectName = getProjectName(issue.projectId).toLowerCase();
                    const assignedName = getUserName(issue.assignedMemberId).toLowerCase();
                    const description = issue.description?.toLowerCase() || "";
                    const name = issue.name.toLowerCase();
                    const priorityText = getPriorityDetails(issue.priority).text.toLowerCase();

                    // Search across multiple relevant fields
                    return (
                        name.includes(lowerCaseQuery) ||
                        projectName.includes(lowerCaseQuery) ||
                        assignedName.includes(lowerCaseQuery) ||
                        description.includes(lowerCaseQuery) ||
                        priorityText.includes(lowerCaseQuery) || // Allow searching by priority text
                        issue.id.toString() === lowerCaseQuery // Allow searching by ID
                    );
                });
            }
        }

        // --- Optional: Add Sorting ---
        // Example: Sort by deadline (ascending), then priority (descending)
        issues.sort((a, b) => {
             try {
                const dateA = parseISO(a.deadline + 'T00:00:00Z').getTime();
                const dateB = parseISO(b.deadline + 'T00:00:00Z').getTime();
                if (dateA !== dateB) return dateA - dateB; // Sort by date first
            } catch {
                // Handle potential parsing errors during sort if needed
            }
            // If dates are the same or invalid, sort by priority (High first)
            return a.priority - b.priority;
        });


        return issues;
    // Dependencies: Only re-filter when filter or search query changes. Mock data is static.
    }, [selectedFilter, searchQuery]);


    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)", // Adjust if AppBar height differs
                paddingTop: "64px", // Match AppBar height
                backgroundColor: theme.palette.background.default, // Use theme default background
                // Enhanced background gradient
                backgroundImage: `radial-gradient(circle at 10% 10%, ${theme.palette.primary.dark}10, transparent 50%), radial-gradient(circle at 90% 90%, ${theme.palette.secondary.dark}15, transparent 60%)`,
                backgroundAttachment: 'fixed', // Keep gradient fixed during scroll
                display: "flex",
                justifyContent: "center",
                p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                boxSizing: 'border-box',
                overflow: 'hidden', // Prevent potential horizontal scrollbars from gradients
            }}
        >
            <Stack
                spacing={4}
                sx={{
                    width: "100%",
                    maxWidth: "950px", // Slightly wider max width
                }}
            >
                 {/* Header */}
                 <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'space-between' }, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="text.primary" >
                        Activity Feed
                    </Typography>
                    {/* Display count of items shown */}
                    <Typography variant="overline" color="text.secondary">
                         {isLoading ? 'Loading...' : `${filteredIssues.length} item${filteredIssues.length !== 1 ? 's' : ''} found`}
                    </Typography>
                 </Box>

                {/* Filter + Search Controls Paper */}
                <Paper
                     elevation={4} // Slightly more elevation for the control bar
                     sx={{
                       display: "flex",
                       flexDirection: { xs: 'column', lg: 'row' }, // Switch to row later on larger screens
                       justifyContent: "space-between",
                       alignItems: { lg: "center" },
                       gap: 2.5, // Increased gap
                       p: 3, // Increased padding
                       backgroundColor: theme.palette.background.paper, // Use theme paper background
                       borderRadius: 4, // More rounded corners
                       position: 'sticky',
                       top: 72, // Adjust based on AppBar height + desired spacing
                       zIndex: 1100, // Ensure it's above cards
                       // Subtle border
                       border: `1px solid ${theme.palette.divider}`,
                       boxShadow: theme.shadows[3], // Add subtle shadow
                     }}
                >
                    {/* Filter Toggle Group */}
                     <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }} > {/* Increased gap */}
                         <FilterListIcon sx={{ color: theme.palette.text.secondary, display: { xs: 'none', sm: 'block' } }}/>
                        <ToggleButtonGroup
                            value={selectedFilter}
                            exclusive
                            onChange={handleFilterChange} // Use memoized handler
                            aria-label="Activity Filters"
                            size="small" // Make buttons slightly smaller
                            sx={{
                                flexWrap: 'wrap',
                                gap: 1, // Gap between buttons
                                // Styling for individual buttons
                                '.MuiToggleButtonGroup-grouped': {
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '20px !important', // Pill shape
                                    padding: theme.spacing(0.75, 2), // Adjust padding
                                    color: theme.palette.text.secondary,
                                    backgroundColor: 'transparent',
                                    textTransform: "none", // Keep label case
                                    transition: theme.transitions.create(['background-color', 'color', 'border-color', 'box-shadow'], { duration: theme.transitions.duration.short }),
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        color: theme.palette.text.primary,
                                        borderColor: theme.palette.grey[500],
                                    },
                                    // Styling for the selected button
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        fontWeight: 600,
                                        borderColor: `${theme.palette.primary.dark} !important`, // Ensure border color overrides
                                        boxShadow: `0 2px 8px -2px ${theme.palette.primary.dark}`, // Add subtle shadow to selected
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            borderColor: theme.palette.primary.dark,
                                        },
                                    },
                                    // Icon styling within buttons
                                    '& .MuiSvgIcon-root': {
                                        marginRight: theme.spacing(0.8),
                                        fontSize: '1.1rem', // Slightly larger icon
                                        // Color change on select/hover can be added if needed
                                        // color: 'inherit' // Ensures icon color matches text
                                    }
                                }
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
                        placeholder="Search name, project, assignee, description..."
                        value={searchQuery}
                        onChange={handleSearchChange} // Use memoized handler
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search">
                                        <IconButton
                                            aria-label="clear search"
                                            onClick={clearSearch} // Use memoized handler
                                            edge="end"
                                            size="small"
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '20px', // Match filter button shape
                                backgroundColor: theme.palette.action.focus, // Subtle background
                                color: theme.palette.text.primary,
                                transition: theme.transitions.create(['border-color', 'box-shadow']),
                                '& fieldset': { borderColor: theme.palette.divider, transition: theme.transitions.create('border-color') },
                                '&:hover fieldset': { borderColor: theme.palette.primary.light },
                                '&.Mui-focused': { // Add subtle glow on focus
                                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
                                    '& fieldset': {
                                         borderColor: theme.palette.primary.main,
                                         borderWidth: '1px !important', // Ensure focus ring doesn't double border
                                    }
                                },
                                'input::placeholder': { color: theme.palette.text.disabled, opacity: 1 }
                            }
                        }}
                        sx={{ minWidth: { xs: '100%', lg: 350 } }} // Take full width on small, fixed on large
                    />
                </Paper>

                {/* Activity List Area */}
                {/* Use overflowY on a nested Box to ensure sticky header works correctly */}
                <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 0.5, // Add slight padding for scrollbar space
                    // Calculate max height to allow scrolling within the container below the sticky header
                    // Adjust '180px' based on the actual height of header + filter bar + spacing
                     maxHeight: 'calc(100vh - 64px - 80px - 64px - 32px)', // Vh - TopPad - Header - FilterBar - StackSpacing
                     minHeight: 200, // Ensure a minimum height even if empty
                }}>
                    {isLoading ? (
                        // Loading State
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredIssues.length > 0 ? (
                        // List of Cards
                         <Stack spacing={0}> {/* Let cards handle their own margin bottom */}
                            {filteredIssues.map((issue, index) => ( // Pass index for stagger
                                <ActivityCard
                                    key={issue.id}
                                    issue={issue}
                                    isExpanded={expandedIssueId === issue.id}
                                    onToggleExpand={handleToggleExpand}
                                    onNavigateToCalendar={handleNavigateToCalendar}
                                    onNavigateToIssue={handleNavigateToIssue}
                                    index={index} // Pass index here
                                />
                            ))}
                         </Stack>
                    ) : (
                         // Empty State Message
                         <Fade in timeout={TRANSITION_DURATION}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8, color: theme.palette.text.secondary, textAlign: 'center' }}>
                                <ErrorOutlineIcon sx={{ fontSize: 56, mb: 2, color: theme.palette.warning.main }} /> {/* Larger icon, warning color */}
                                <Typography variant="h6" fontWeight={500} >
                                    No activities found
                                </Typography>
                                <Typography variant="body1" >
                                    {searchQuery ? "Try adjusting your search query." : "Try selecting a different filter."}
                                </Typography>
                                {searchQuery && (
                                    <Button onClick={clearSearch} variant="text" sx={{ mt: 2}}>Clear Search</Button>
                                )}
                            </Box>
                         </Fade>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default Activity;