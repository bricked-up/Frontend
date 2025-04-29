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

// --- Constants ---
const FILTERS = [
  { value: "Unread", label: "Unread", icon: <InboxIcon fontSize="small" /> },
  {
    value: "@Mentions",
    label: "@Mentions",
    icon: <AlternateEmailIcon fontSize="small" />,
  },
  { value: "Tags", label: "Tags", icon: <LocalOfferIcon fontSize="small" /> },
];

const TRANSITION_DURATION = 300; // ms

// --- Helper Type ---
interface ActivityCardProps {
  issue: Issue;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onNavigateToCalendar: (date: Date) => void;
}

// --- ActivityCard Component ---
const ActivityCard: React.FC<ActivityCardProps> = ({
  issue,
  isExpanded,
  onToggleExpand,
  onNavigateToCalendar,
}) => {
  const theme = useTheme();

  const handleCardClick = () => {
    onToggleExpand(issue.id);
  };

  const handleDueDateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion toggle
    onNavigateToCalendar(issue.completed); // Pass the Date object
  };

  // Mock "unread" status for visual demonstration
  const isUnread = issue.id === 1 || issue.id === 3;

  // Format the date for display
  const formattedDueDate = issue.completed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Grow in timeout={TRANSITION_DURATION}>
      <Card
        sx={{
          // Keeping specific card styling as requested
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[700]
              : theme.palette.grey[900],

          color: theme.palette.common.white,
          borderRadius: 3,
          mb: 2,
          transition: `transform ${TRANSITION_DURATION}ms ease-in-out, box-shadow ${TRANSITION_DURATION}ms ease-in-out, border-left ${TRANSITION_DURATION}ms ease-in-out`,
          borderLeft: isUnread
            ? `4px solid ${theme.palette.primary.main}`
            : `4px solid transparent`,
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: `0 8px 25px -5px ${theme.palette.primary.dark}`,
          },
        }}
      >
        <CardActionArea
          onClick={handleCardClick}
          aria-expanded={isExpanded}
          aria-controls={`activity-details-${issue.id}`}
          sx={{ p: 2 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={600} component="div">
                {issue.name}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                aria-label={
                  isExpanded ? "Collapse issue details" : "Expand issue details"
                }
                sx={{
                  color: theme.palette.grey[400],
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: theme.transitions.create("transform", {
                    duration: theme.transitions.duration.short,
                  }),
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Stack>
          </Stack>
        </CardActionArea>
        <Collapse in={isExpanded} timeout={TRANSITION_DURATION} unmountOnExit>
          <Divider sx={{ borderColor: theme.palette.grey[700], mx: 2 }} />
          <CardContent sx={{ pt: 2, px: 3, pb: 3 }}>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 3 }}
                alignItems={{ sm: "flex-start" }}
              >
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    Completed By
                  </Typography>
                  {/* FIX: Adjusted Chip styling for icon alignment */}
                  <Chip
                    icon={
                      <CalendarTodayIcon
                        sx={{
                          fontSize: "1rem" /* Optional: Adjust icon size */,
                        }}
                      />
                    }
                    label={formattedDueDate}
                    variant="outlined"
                    size="small"
                    onClick={handleDueDateClick}
                    clickable
                    sx={{
                      cursor: "pointer",
                      color: theme.palette.warning.light,
                      borderColor: theme.palette.warning.dark,
                      backgroundColor: "rgba(255, 183, 77, 0.1)",
                      height: "auto", // Allow height to adjust naturally
                      "& .MuiChip-label": {
                        // Target the label specifically
                        paddingTop: "3px", // Fine-tune vertical alignment if needed
                        paddingBottom: "3px",
                      },
                      "& .MuiChip-icon": {
                        // Target the icon specifically
                        marginLeft: "8px", // Adjust spacing if needed
                        marginRight: "-4px", // Adjust spacing if needed
                        // Icons in MUI Chip are usually centered well by default with flex
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 183, 77, 0.2)",
                      },
                    }}
                  />
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary">
                  Description
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: theme.palette.grey[800],
                    borderRadius: 2,
                    padding: 2,
                    color: theme.palette.text.primary,
                    lineHeight: 1.7,
                    fontSize: "0.9rem",
                  }}
                >
                  {issue.description || (
                    <Typography
                      variant="body2"
                      fontStyle="italic"
                      color="text.secondary"
                    >
                      No description provided.
                    </Typography>
                  )}
                </Paper>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Stack spacing={0.5}>
                  <Typography variant="overline" color="text.secondary">
                    Priority
                  </Typography>
                  <Chip label={issue.priority} size="small" />
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="overline" color="text.secondary">
                    Cost
                  </Typography>
                  <Chip label={issue.cost || 0} size="small" />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
    </Grow>
  );
};

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
  const [selectedFilter, setSelectedFilter] = useState<string>(
    FILTERS[0].value
  );
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleToggleExpand = (id: number) => {
    setExpandedIssueId((prevId) => (prevId === id ? null : id));
  };

  const handleNavigateToCalendar = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    navigate(`/calendar?date=${dateString}`);
  };

  // Memoize filtered issues for performance
  const filteredIssues = useMemo(() => {
    // Explicitly type the array copy
    let issues: Issue[] = [...mockActivityData];

    // 1. Filter based on selectedFilter
    if (selectedFilter === "Unread") {
      // Compare numbers correctly
      issues = issues.filter((issue) => issue.id === 1 || issue.id === 3);
    } else if (selectedFilter === "@Mentions") {
      issues = issues.filter((issue) => issue.description?.includes("@"));
    } else if (selectedFilter === "Tags") {
      // Compare numbers correctly
      issues = issues.filter((issue) => issue.id === 2);
    }

    // 2. Filter based on search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      issues = issues.filter(
        (
          issue // issue should be correctly typed now
        ) =>
          issue.name.toLowerCase().includes(lowerCaseQuery) ||
          (issue.description &&
            issue.description.toLowerCase().includes(lowerCaseQuery))
      );
    }

    return issues;
  }, [selectedFilter, searchQuery, mockActivityData]); // Keep mockActivityData dependency

  return (
    <Box
      sx={{
        // FIX: Removed background overrides to inherit from Layout/Theme
        // backgroundColor: theme.palette.grey[900],
        // backgroundImage: 'radial-gradient(...)',
        minHeight: "calc(100vh - 64px)", // Keep minHeight calculation
        paddingTop: "64px", // Keep padding for header space
        display: "flex",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 }, // Keep responsive padding
        boxSizing: "border-box",
        // Ensure this Box takes up the space provided by Layout's Outlet container
        width: "100%",
        height: "100%", // Or adjust based on Layout's structure
      }}
    >
      <Stack
        spacing={4}
        sx={{
          width: "100%",
          maxWidth: "900px", // Keep max width for content centering
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="common.white"
          /* Changed to text.primary for theme consistency */ sx={{
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Activity Feed
        </Typography>
        {/* Filter + Search Controls - Keeping specific styling as requested */}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { md: "center" },
            gap: 2,
            p: 2.5,
            backgroundColor: theme.palette.background.paper, // Use theme's paper background
            borderRadius: 3,
            position: "sticky",
            top: 64, // Adjust if Layout's Topbar height is different
            zIndex: 10,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ flexWrap: "wrap", gap: 1 }}
          >
            <FilterListIcon
              sx={{
                color: theme.palette.text.secondary,
                display: { xs: "none", sm: "block" },
              }}
            />
            <ToggleButtonGroup
              value={selectedFilter}
              exclusive
              onChange={(e, newFilter) => {
                if (newFilter !== null) {
                  setSelectedFilter(newFilter);
                  setExpandedIssueId(null);
                }
              }}
              aria-label="Activity Filters"
              sx={{
                flexWrap: "wrap",
                gap: 1,
                ".MuiToggleButtonGroup-grouped": {
                  border: `1px solid ${theme.palette.divider}`, // Use theme divider color
                  borderRadius: "8px !important",
                  padding: "6px 14px",
                  color: theme.palette.text.secondary, // Use theme text secondary
                  backgroundColor: theme.palette.action.hover, // Use subtle theme background
                  textTransform: "none",
                  transition:
                    "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.action.selected, // Use theme selected action background
                    color: theme.palette.text.primary, // Use theme primary text
                    borderColor: theme.palette.divider,
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    borderColor: theme.palette.primary.dark,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      borderColor: theme.palette.primary.dark,
                    },
                  },
                  "& .MuiSvgIcon-root": {
                    marginRight: theme.spacing(0.8),
                    fontSize: "1rem",
                  },
                },
              }}
            >
              {FILTERS.map((filter) => (
                <ToggleButton
                  key={filter.value}
                  value={filter.value}
                  aria-label={filter.label}
                >
                  {filter.icon}
                  {filter.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearchQuery("")}
                    edge="end"
                    size="small"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 5.354a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: theme.palette.background.default, // Use theme default background
                color: theme.palette.text.primary, // Use theme primary text
                transition: "border-color 0.2s ease",
                "& fieldset": {
                  borderColor: theme.palette.divider, // Use theme divider
                  transition: "border-color 0.2s ease",
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.light,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: "1px",
                },
                "input::placeholder": {
                  color: theme.palette.text.disabled, // Use theme disabled text for placeholder
                  opacity: 1,
                },
              },
            }}
            sx={{
              minWidth: { xs: "100%", md: 300 },
            }}
          />
        </Paper>
        {/* Issue List Area */}
        {/* Adjust maxHeight calculation if needed */}
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 64px - 100px - 32px)",
            pr: 0.5,
          }}
        >
          {filteredIssues.length > 0 ? (
            <Stack spacing={0}>
              {/* Explicitly type issue in map callback */}
              {filteredIssues.map((issue: Issue) => (
                <ActivityCard
                  key={issue.id}
                  issue={issue} // Should now be correctly typed
                  isExpanded={expandedIssueId === issue.id} // Comparison should be correct (number === number)
                  onToggleExpand={handleToggleExpand}
                  onNavigateToCalendar={handleNavigateToCalendar}
                />
              ))}
            </Stack>
          ) : (
            <Fade in timeout={500}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 8,
                  color: theme.palette.text.secondary /* Use theme color */,
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6">No activities found</Typography>
                <Typography variant="body2">
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
