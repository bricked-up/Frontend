import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Card,
  CardContent,
  Grid,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { mockActivityData, TaskItem } from "./mockActivityData";

const filters = ["Unread", "@Mentions", "Tags"];

const Activity: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Unread");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedTaskId((prevId) => (prevId === id ? null : id));
  };

  const filteredTasks = mockActivityData.filter((task) =>
    task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        paddingTop: "64px", // space for header if fixed
        overflow: "hidden", // prevent outer scrollbars
      }}
    >
      {/* Left Side Menu */}
      <Box
        sx={{
          width: "220px",
          borderRight: "1px solid #444",
          paddingRight: 2,
          marginRight: 2,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Activity
        </Typography>
        <List>
          {filters.map((filter) => (
            <ListItemButton
              key={filter}
              selected={selectedFilter === filter}
              onClick={() => setSelectedFilter(filter)}
              sx={{
                borderRadius: "8px",
                marginBottom: "4px",
                "&.Mui-selected": {
                  backgroundColor: "#3f51b5",
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "#3f51b5",
                  color: "white",
                },
              }}
            >
              <ListItemText primary={filter} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main Content Scrollable */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "100%", // full height of remaining space
          paddingRight: 2,
        }}
      >
        {/* Search Bar */}
        <Box mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ transition: "transform 0.3s ease" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#2c2c2c",
              color: "white",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#3f51b5",
                },
              },
            }}
          />
        </Box>

        {/* Task Cards */}
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task.id}>
              <Card
                sx={{
                  backgroundColor: "#2c2c2c",
                  color: "white",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.3s ease",
                  },
                  borderRadius: "8px",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() => handleToggleExpand(task.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {task.taskName}
                      </Typography>
                      <Typography variant="body2" color="gray">
                        Team: {task.teamName} | Project: {task.projectName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Badge
                        color="primary"
                        variant="dot"
                        sx={{ marginRight: 1 }}
                      />
                      <IconButton sx={{ color: "white" }}>
                        {expandedTaskId === task.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Expanded Content */}
                  <Collapse in={expandedTaskId === task.id} timeout="auto" unmountOnExit>
                    <Box mt={2}>
                      <Typography variant="body2">
                        <strong>Due Date:</strong> {task.dueDate}
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        <strong>Description:</strong> {task.description}
                      </Typography>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Activity;
