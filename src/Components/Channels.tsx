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
  id: number;
  status: string;
  name: string;
  members: number;
  tasks: string;
  publishedBy: string;
  taskDescription: string;
}

// Sample data for channels
const rows: ChannelData[] = [
  { id: 1, status: "Online", name: "DevOps", members: 120, tasks: "Deploy API", publishedBy: "Alice", taskDescription: "Deploy the API to production with all necessary configurations." },
  { id: 2, status: "Offline", name: "Frontend", members: 95, tasks: "Update UI", publishedBy: "Bob", taskDescription: "Redesign the landing page to improve user experience." },
  { id: 3, status: "Online", name: "Backend", members: 85, tasks: "Fix Auth", publishedBy: "Charlie", taskDescription: "Resolve authentication token expiration issues." },
  { id: 4, status: "Offline", name: "Design", members: 60, tasks: "Create Wireframe", publishedBy: "Dave", taskDescription: "Design wireframes for the new admin dashboard." },
];

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
  // Displays popover for channel name
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
        <Typography variant="h6" sx={{ padding: 2, color: "#fff", backgroundColor: "#1A1A1A" }}>
          Channels
        </Typography>
        <Divider sx={{ backgroundColor: "#333" }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={6} sx={{ backgroundColor: "#1A1A1A", padding: 2 }}>
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
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#1A1A1A" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rows.length}
                  checked={selected.length === rows.length}
                  onChange={handleSelectAll}
                  sx={{ color: "#fff" }}
                />
              </TableCell>
              <TableCell sx={{ color: "#aaa" }}>Status</TableCell>
              <TableCell sx={{ color: "#aaa" }}>Channel Name</TableCell>
              <TableCell sx={{ color: "#aaa" }}>Members</TableCell>
              <TableCell sx={{ color: "#aaa" }}>Tasks</TableCell>
              <TableCell sx={{ color: "#aaa" }}>Published By</TableCell>
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
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: row.status === "Online" ? "#008000" : "#555",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Box
                      onClick={() => handleChannelClick(row.name)}
                      sx={{
                        display: "inline-block",
                        padding: "4px 8px",
                        backgroundColor: "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        borderRadius: "4px",
                        '&:hover': {
                          backgroundColor: "#333",
                        },
                      }}
                    >
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.members}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(event) => handleTaskClick(event, row.taskDescription)}
                      sx={{ color: "#fff", textTransform: "none" }}
                    >
                      {row.tasks}
                    </Button>
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.publishedBy}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ color: "#fff", textAlign: "center", padding: 3 }}>
                  No channels found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Channels;