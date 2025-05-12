// src/components/Activity.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
  Collapse,
  Stack,
  Chip,
  Divider,
  Fade,
  Grow,
  CircularProgress,
  Skeleton,
  useTheme,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useNavigate } from "react-router-dom";
import { Issue, GetUserResult, GetIssueResult, User } from "../utils/types";
import { getUser, getIssue } from "../utils/getters.utils";

const TRANSITION_DURATION = 300;
const priorityColor: Record<number, string> = {
  1: "#4caf50",
  2: "#ff9800",
  3: "#f44336",
};

interface ActivityCardProps {
  issue: Issue;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onNavigateToCalendar: (date: Date) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  issue,
  isExpanded,
  onToggleExpand,
  onNavigateToCalendar,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const handleCardClick = () => onToggleExpand(issue.id);
  const handleDueDateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    issue.completed && onNavigateToCalendar(issue.completed);
  };
  const formattedDueDate = issue.completed
    ? issue.completed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No due date";

  return (
    <Grow in timeout={TRANSITION_DURATION}>
      <Card
        elevation={isExpanded ? 8 : 2}
        sx={{
          mb: 2,
          position: "relative",
          borderRadius: 3,
          backgroundColor: isDark
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
          color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[6],
          },
          transition: "transform 0.2s, box-shadow 0.2s",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "4px",
            backgroundColor:
              priorityColor[issue.priority ?? 1] || theme.palette.primary.main,
            borderTopLeftRadius: "3px",
            borderBottomLeftRadius: "3px",
          },
          pl: "12px",
        }}
      >
        <CardActionArea onClick={handleCardClick} sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              {issue.title}
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: theme.transitions.create("transform", {
                  duration: theme.transitions.duration.short,
                }),
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Stack>
        </CardActionArea>
        <Collapse in={isExpanded} timeout={TRANSITION_DURATION} unmountOnExit>
          <Divider
            sx={{
              my: 1,
              borderColor: isDark
                ? theme.palette.grey[800]
                : theme.palette.grey[300],
            }}
          />
          <CardContent>
            <Stack spacing={2}>
              <Chip
                icon={<CalendarTodayIcon />}
                label={formattedDueDate}
                onClick={handleDueDateClick}
                clickable
                sx={{
                  backgroundColor: isDark
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
                  color: isDark
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                }}
              />
              <Typography variant="body2">
                {issue.desc ?? <em>No desc provided.</em>}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  label={`Priority: ${issue.priority ?? 0}`}
                  sx={{
                    backgroundColor: isDark
                      ? theme.palette.grey[800]
                      : theme.palette.grey[400],
                  }}
                />
                <Chip
                  label={`Cost: ${issue.cost ?? 0}`}
                  sx={{
                    backgroundColor: isDark
                      ? theme.palette.grey[800]
                      : theme.palette.grey[400],
                  }}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
    </Grow>
  );
};

const Activity: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    (async () => {
      try {
        const rawUser = localStorage.getItem("userid");
        if (!rawUser) throw new Error("User ID not found in localStorage");
        const userId = Number(rawUser);
        if (isNaN(userId)) throw new Error("Invalid user ID in localStorage");

        const userRes: GetUserResult = await getUser(userId);
        if (userRes.status !== 200 || !userRes.data)
          throw new Error(userRes.error || "Failed to load user");
        const ids = userRes.data.issues ?? [];

        const results: GetIssueResult[] = await Promise.all(
          ids.map((id) => getIssue(id))
        );
        const loaded = results
          .filter((r) => r.status === 200 && r.data)
          .map((r) => r.data!);
        setIssues(loaded);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggleExpand = (id: number) =>
    setExpandedIssueId((prev) => (prev === id ? null : id));
  const handleNavigateToCalendar = (date: Date) =>
    navigate(`/calendar?date=${date.toISOString().split("T")[0]}`);

  const filteredIssues = useMemo(() => {
    if (!searchQuery) return issues;
    const q = searchQuery.toLowerCase();
    return issues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.desc?.toLowerCase().includes(q) ?? false)
    );
  }, [issues, searchQuery]);

  if (loading)
    return (
      <Box
        textAlign="center"
        p={4}
        sx={{
          backgroundColor: isDark ? theme.palette.background.default : "#fff",
        }}
      >
        <Stack spacing={1}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={100}
              animation="wave"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Box>
    );
  if (error)
    return (
      <Box
        textAlign="center"
        p={4}
        sx={{
          backgroundColor: isDark ? theme.palette.background.default : "#fff",
        }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDark ? theme.palette.background.default : "#f9f9f9",
      }}
    >
      {/* Header */}

      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ color: isDark ? "#fafafa" : "#212121", mb: 2 }}
      >
        Activity Feed
      </Typography>
      <Paper
        sx={{
          p: 2,
          position: "sticky",
          top: 64,
          zIndex: 10,
          backgroundColor: isDark ? theme.palette.background.paper : "#fff",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: isDark ? "#fafafa" : "#757575" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            style: { color: isDark ? "#fafafa" : "#212121" },
          }}
          sx={{
            ".MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDark ? "#555" : "#ccc",
              },
              "&:hover fieldset": {
                borderColor: isDark ? "#888" : "#888",
              },
            },
          }}
        />
      </Paper>

      {/* Scrollable List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 2,
        }}
      >
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <ActivityCard
                key={issue.id}
                issue={issue}
                isExpanded={expandedIssueId === issue.id}
                onToggleExpand={handleToggleExpand}
                onNavigateToCalendar={handleNavigateToCalendar}
              />
            ))
          ) : (
            <Fade in timeout={300}>
              <Box
                textAlign="center"
                mt={8}
                sx={{ color: theme.palette.text.secondary }}
              >
                <ErrorOutlineIcon fontSize="large" />
                <Typography variant="h6">No activities found</Typography>
                <Typography variant="body2">
                  Try searching for activities.
                </Typography>
              </Box>
            </Fade>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Activity;
