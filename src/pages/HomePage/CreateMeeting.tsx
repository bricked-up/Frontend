import React, { useState, useEffect } from "react";
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

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
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

  const channels = [
    { name: "ABC", task: "Create database", details: "Design and implement a relational database.", publishedBy: "David" },
    { name: "DEF", task: "Update SQL", details: "Optimize queries and improve database performance.", publishedBy: "Steve" },
    { name: "XYZ", task: "Create login page", details: "Design and build a responsive login page.", publishedBy: "Pajet" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", backgroundColor: "#f5f5dc" }}>
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>BRICKEDUP</Typography>
          <div>
            <Button color="inherit">Create Channel</Button>
            <Button color="inherit">Leave Channel</Button>
            <Button color="inherit">Edit Channel</Button>
            <Button color="inherit">About</Button>
          </div>
          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>{user.profilePic ? <Avatar src={user.profilePic} /> : <Avatar>{user.name.charAt(0)}</Avatar>}</IconButton>
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
            <Typography variant="h5" gutterBottom>Channels & Tasks</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#3f51b5" }}>
                    <TableCell sx={{ color: "white" }}>Channel Name</TableCell>
                    <TableCell sx={{ color: "white" }}>Task</TableCell>
                    <TableCell sx={{ color: "white" }}>Published By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {channels.map((channel, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>
                          <Button onClick={() => handleChannelClick(channel.name)} sx={{ textTransform: "none", fontWeight: "bold" }}>{channel.name}</Button>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleTaskClick(channel.task)} sx={{ textTransform: "none" }}>{channel.task}</Button>
                          <Collapse in={expandedTask === channel.task}>
                            <Typography sx={{ padding: 1 }}>{channel.details}</Typography>
                          </Collapse>
                        </TableCell>
                        <TableCell>{channel.publishedBy}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" sx={{ mt: 3 }} gutterBottom><CalendarMonthIcon /> Calendar</Typography>
            <Paper sx={{ padding: 2 }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
                height="auto"
              />
            </Paper>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
