import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Calendar,
  dateFnsLocalizer,
  View,
  Views,
  NavigateAction,
  ToolbarProps,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  differenceInDays,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";
import { Issue } from "../../utils/types"; // Import the Issue type
import { mockActivityData } from "../../utils/mock_Activity_Calendar_Data"; // Mock data
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { "en-US": enUS },
});

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Issue;
};

const events: CalendarEvent[] = mockActivityData
  .filter((item): item is Issue & { completed: Date } => !!item.completed)
  .map((item) => ({
    id: item.id,
    title: item.title,
    start: item.completed,
    end: item.completed,
    resource: item,
  }));

const CustomToolbar: React.FC<ToolbarProps<CalendarEvent, object>> = ({
  label,
  onNavigate,
  onView,
  view,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = (action: NavigateAction) => onNavigate(action);

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1, 2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        flexWrap: "wrap",
        gap: theme.spacing(1),
        mb: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Today">
          <IconButton onClick={() => navigate("TODAY") as any}><Today /></IconButton>
        </Tooltip>
        <Tooltip title="Previous">
          <IconButton onClick={() => navigate("PREV") as any}><ArrowBack /></IconButton>
        </Tooltip>
        <Tooltip title="Next">
          <IconButton onClick={() => navigate("NEXT") as any}><ArrowForward /></IconButton>
        </Tooltip>
      </Stack>
      <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mx: 2, color: 'white' }}>{label}</Typography>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e, v) => v && onView(v)}
        size="small"
        aria-label="Calendar view"
      >
        <ToggleButton value={Views.MONTH} sx={{ color: 'white' }}>Month</ToggleButton>
        <ToggleButton value={Views.WEEK} sx={{ color: 'white' }}>Week</ToggleButton>
        <ToggleButton value={Views.DAY} sx={{ color: 'white' }}>Day</ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
};

const CustomCalendar: React.FC = () => {
  const theme = useTheme();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const now = new Date();
    const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventStartDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
    const diff = differenceInDays(eventStartDay, startOfDayNow);
    let bg = "#ccff90";
    if (diff < 1) bg = "#f28b82";
    else if (diff < 3) bg = "#fff475";

    return {
      style: {
        backgroundColor: bg,
        color: 'white', // Ensuring the text is white
        borderRadius: "4px",
        border: "none",
        opacity: diff < 0 ? 0.7 : 0.95,
        display: "block",
        padding: "2px 5px",
        fontSize: "0.8em",
        cursor: "pointer",
      },
    };
  }, [theme]);

  const handleNavigate = useCallback<(
    action: NavigateAction,
    newDate?: Date
  ) => void>((action, newDate) => {
    if (newDate) setDate(newDate);
  }, []);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: "white", // Ensure the font color is white for the entire component
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", minHeight: 0 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          style={{ height: "100%" }}
          popup
        />
      </Box>
    </Box>
  );
};

export default CustomCalendar;
