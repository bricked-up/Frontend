import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
}

interface Channel {
  name: string;
  task: string;
  details: string;
  publishedBy: string;
  deadline: string;
}

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const user = { name: "John Doe", profilePic: "" };

  useEffect(() => {
    fetch("/data/calendar.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error loading calendar events", err));
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChannelClick = (channel: string) => {
    navigate(`/channel/${channel}`);
  };

  const handleTaskClick = (task: string) => {
    setExpandedTask(expandedTask === task ? null : task);
  };

  const channels: Channel[] = useMemo(() => [
    { name: "ABC", task: "Create database", details: "Design and implement a relational database.", publishedBy: "David", deadline: "2025-03-09" },
    { name: "DEF", task: "Update SQL", details: "Optimize queries and improve database performance.", publishedBy: "Steve", deadline: "2025-03-25" },
    { name: "XYZ", task: "Create login page", details: "Design and build a responsive login page.", publishedBy: "Pajet", deadline: "2025-03-13" },
  ], []);

  const deadlineEvents = useMemo(() => {
    return channels.map((channel) => {
      const today = dayjs();
      const deadline = dayjs(channel.deadline);
      const diffDays = deadline.diff(today, "day");

      let backgroundColor = "#32cd32"; // Green

      if (diffDays < 0) {
        backgroundColor = "#FF0000"; // Red if the day has passed
      } else if (diffDays < 3) {
        backgroundColor = "#FF5555"; // Orange
      } else if (diffDays < 7) {
        backgroundColor = "#FFD700"; // Yellow
      }

      return {
        title: `${channel.name}: ${channel.task}`,
        start: channel.deadline,
        allDay: true,
        backgroundColor,
        textColor: "#000000",
      };
    });
  }, [channels]);

  useEffect(() => {
    setEvents((prevEvents) => {
      const filteredPrevEvents = prevEvents.filter(event => 
        !channels.some(channel => event.title === `${channel.name}: ${channel.task}`)
      );
      return [...filteredPrevEvents, ...deadlineEvents];
    });
  }, [deadlineEvents, channels]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", backgroundColor: "#f5f5dc" }}>
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>BRICKEDUP</Typography>
          <div>
            <Button color="inherit">Create Channel</Button>
            <Button color="inherit">Leave Channel</Button>
            <Button color="inherit">Edit Channel</Button>
            <Button color="inherit">About</Button>
          </div>
          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
            {user.profilePic ? <Avatar src={user.profilePic} /> : <Avatar>{user.name.charAt(0)}</Avatar>}
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Dashboard</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <div style={{ display: "flex", flex: 1, padding: "20px" }}>
        <Paper sx={{ width: "250px", padding: 2, backgroundColor: "#f0f8ff", flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Navigation</Typography>
          <Button fullWidth sx={{ mt: 1, color: "#3f51b5" }}>Home</Button>
          <Button fullWidth sx={{ mt: 1, color: "#3f51b5" }}>Meetings</Button>
          <Button fullWidth sx={{ mt: 1, color: "#3f51b5" }}>Create Meeting</Button>
          <Button fullWidth sx={{ mt: 1, color: "#3f51b5" }}>Settings</Button>
        </Paper>

        <div style={{ flex: 1, marginLeft: "20px" }}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "black", padding: "10px", textAlign: "center", borderRadius: "4px" }}>
              Channels & Tasks
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#3f51b5" }}>
                    <TableCell sx={{ color: "white" }}>Channel Name</TableCell>
                    <TableCell sx={{ color: "white" }}>Task</TableCell>
                    <TableCell sx={{ color: "white" }}>Deadline</TableCell>
                    <TableCell sx={{ color: "white" }}>Published By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {channels.map((channel, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button onClick={() => handleChannelClick(channel.name)} sx={{ textTransform: "none", fontWeight: "bold" }}>{channel.name}</Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleTaskClick(channel.task)} sx={{ textTransform: "none" }}>{channel.task}</Button>
                        <Collapse in={expandedTask === channel.task}>
                          <Typography sx={{ padding: 1 }}>{channel.details}</Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell>{channel.deadline}</TableCell>
                      <TableCell>{channel.publishedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "black", padding: "10px", textAlign: "center", borderRadius: "4px", mt: 3 }}>
              <CalendarMonthIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Calendar
            </Typography>
            <Paper sx={{ padding: 2, mt: 2 }}>
              <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={events} height="auto" />
            </Paper>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
