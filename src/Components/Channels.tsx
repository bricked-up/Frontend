import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  Divider,
  Popover,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ChannelData represents the structure of a channel with relevant details
interface ChannelData {
  id: number; // Unique identifier for the channel
  status: string; // Status of the channel (Online/Offline)
  name: string; // Name of the channel
  members: number; // Number of members in the channel
  tasks: string; // Task assigned to the channel
  publishedBy: string; // Person who assigned the task
  taskDescription: string; // Detailed description of the task
}

// Sample data for channels
const rows: ChannelData[] = [
  { id: 1, status: "Online", name: "DevOps", members: 120, tasks: "Deploy API", publishedBy: "Alice", taskDescription: "Deploy the API to production with all necessary configurations." },
  { id: 2, status: "Offline", name: "Frontend", members: 95, tasks: "Update UI", publishedBy: "Bob", taskDescription: "Redesign the landing page to improve user experience." },
  { id: 3, status: "Online", name: "Backend", members: 85, tasks: "Fix Auth", publishedBy: "Charlie", taskDescription: "Resolve authentication token expiration issues." },
  { id: 4, status: "Offline", name: "Design", members: 60, tasks: "Create Wireframe", publishedBy: "Dave", taskDescription: "Design wireframes for the new admin dashboard." },
];

// Channels component displays a list of available channels with search functionality
function Channels() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [taskContent, setTaskContent] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Handles selection of all checkboxes
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? rows.map((row) => row.id) : []);
  };

  // Handles selection of individual checkboxes
  const handleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  // Navigates to the selected channel's page
  const handleChannelClick = (channelName: string) => {
    navigate(`/channels/${channelName.toLowerCase()}`);
  };

  // Displays task description in a popover
  const handleTaskClick = (event: React.MouseEvent<HTMLButtonElement>, taskDescription: string) => {
    setAnchorEl(event.currentTarget);
    setTaskContent(taskDescription);
  };

  // Closes the popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Filters the rows based on the search input
  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.tasks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.publishedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="start" minHeight="100vh" bgcolor="#2A2A2A" paddingTop={4}>
      <TableContainer component={Paper} sx={{ width: "90%", backgroundColor: "#1E1E1E", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ padding: 2, color: "#fff", backgroundColor: "#1A1A1A", textAlign: "center" }}>Channels</Typography>
        <Divider sx={{ backgroundColor: "#333" }} />

        {/* Search Bar */}
        <Box sx={{ padding: 2, backgroundColor: "#1A1A1A" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: "#1E1E1E",
              borderRadius: 1,
              input: { color: "#fff" },
              fieldset: { borderColor: "#555" },
            }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#121212", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rows.length}
                  checked={selected.length === rows.length}
                  onChange={handleSelectAll}
                  sx={{ color: "#fff" }}
                />
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Channel Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Members</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tasks</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Published By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                      sx={{ color: "#fff" }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.status}</TableCell>
                  <TableCell sx={{ color: "#fff", cursor: "pointer", '&:hover': { textDecoration: "underline" } }} onClick={() => handleChannelClick(row.name)}>{row.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.members}</TableCell>
                  <TableCell>
                    <Button onClick={(event) => handleTaskClick(event, row.taskDescription)} sx={{ color: "#fff", textTransform: "none" }}>{row.tasks}</Button>
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.publishedBy}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "#fff" }}>No channels found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Channels;
