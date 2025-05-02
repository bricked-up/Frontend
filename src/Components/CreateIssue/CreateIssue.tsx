/**
 * CreateIssue.tsx
 *
 * This file defines the CreateTask component for managing project issues.
 * It allows adding, editing, completing, and deleting tasks.
 * Tasks are visually divided into 'In Progress' and 'Completed' sections.
 */
import React, { useState } from "react";
import { Tabs, Tab, Slide, Paper, Grow } from "@mui/material";
import { Button, Box, Typography, Grid, Fade } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Board, Task } from "../../utils/types";
import { TaskCard } from "./TaskCard";
import { AddIssue } from "./AddIssue";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

interface CreateTaskPageProps {
  board: Board;
}

export const mockBoard: Board = {
  id: 1,
  name: "Project Board",
  createdBy: "Kejsi",
  createdById: "user-1",
  createdAt: new Date(),
  tasks: [
    {
      id: "task-1",
      title: "Setup Project Repository",
      desc: "Initialize GitHub repository and push the initial commit.",
      tagid: 1,
      priority: 1,
      cost: 100,
      created: new Date("2024-04-01"),
      createdBy: "Kejsi",
      completed: undefined,
    },
    {
      id: "task-2",
      title: "Create Database Schema",
      desc: "Design and create tables for users, projects, and issues.",
      tagid: 2,
      priority: 2,
      cost: 300,
      created: new Date("2024-04-02"),
      createdBy: "Kejsi",
      completed: undefined,
    },
    {
      id: "task-3",
      title: "Implement User Authentication",
      desc: "Login, signup, password reset, and session management.",
      tagid: 3,
      priority: 1,
      cost: 250,
      created: new Date("2024-04-04"),
      createdBy: "Kejsi",
      completed: new Date("2024-04-06"),
    },
    {
      id: "task-4",
      title: "Build Issue Tracking Dashboard",
      desc: "Frontend UI to create, view, edit, and complete issues.",
      tagid: 1,
      priority: 3,
      cost: 400,
      created: new Date("2024-04-07"),
      createdBy: "Kejsi",
      completed: undefined,
    },
    {
      id: "task-5",
      title: "Deploy Application",
      desc: "Deploy backend on server and frontend on Vercel.",
      tagid: 2,
      priority: 2,
      cost: 500,
      created: new Date("2024-04-10"),
      createdBy: "Kejsi",
      completed: undefined,
    },
  ],
};

/**
 * CreateTask Component
 *
 * Displays and manages a board's list of issues.
 * - Allows creating, editing, deleting, and completing tasks.
 * - Supports switching tasks between 'In Progress' and 'Completed' states.
 */
const CreateTask: React.FC<CreateTaskPageProps> = ({ board }) => {
  // Import necessary components
  const { Grid } = require("@mui/material");
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(board.tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: task.completed ? undefined : new Date() }
          : task
      )
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const inProgressTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  //        bgcolor: theme.palette.background.default,

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        paddingBottom: 4,
        bgcolor: theme.palette.background.default,
        color:
          theme.palette.mode === "light" ? colors.grey[800] : colors.grey[100],
        transition: "background-color 0.3s ease",
      }}
    >
      <Box display="flex" justifyContent="center" paddingX={4} paddingTop={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          maxWidth="1200px"
        >
          <Typography variant="h5">{board.name}</Typography>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            color="secondary"
            variant="contained"
            onClick={() => setShowAddTask(true)}
            sx={{ borderRadius: "24px", px: 2 }}
          >
            Add Issue
          </Button>
        </Box>
      </Box>

      <Fade in={true} timeout={1000}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={4}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: "transparent",
                mb: 2,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                variant="fullWidth"
                sx={{
                  minHeight: "60px",
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    minHeight: "60px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "visible",
                    textTransform: "none",
                    color: "text.secondary",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      width: 0,
                      height: "3px",
                      backgroundColor: "primary.main",
                      transition: "all 0.3s ease",
                      transform: "translateX(-50%)",
                      borderRadius: "3px 3px 0 0",
                    },
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: "text.secondary",
                    "&::after": {
                      width: "100%",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <Tab
                  icon={<AssignmentIcon />}
                  iconPosition="start"
                  label={`In Progress (${inProgressTasks.length})`}
                  sx={{
                    "&:first-of-type::after": {
                      width: activeTab === 0 ? "100%" : 0,
                    },
                  }}
                />
                <Tab
                  icon={<CheckCircleIcon />}
                  iconPosition="start"
                  label={`Completed (${completedTasks.length})`}
                  sx={{
                    "&:nth-of-type(2)::after": {
                      width: activeTab === 1 ? "100%" : 0,
                    },
                  }}
                />
              </Tabs>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
              transition: "opacity 0.3s ease",
              minHeight: "200px",
              maxHeight: "calc(100vh - 240px)",
              overflowY: "auto",
              px: 1,
              py: 2,
            }}
          >
            <TabPanel value={activeTab} index={0}>
              {inProgressTasks.length > 0 ? (
                <Grid container spacing={3}>
                  {inProgressTasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Grow in={true} timeout={300}>
                        <Box>
                          <TaskCard
                            task={task}
                            boardId={board.id}
                            onDelete={handleDeleteTask}
                            onComplete={handleCompleteTask}
                            onEdit={handleEditTask}
                          />
                        </Box>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 4,
                    mt: 2,
                  }}
                >
                  <AssignmentLateIcon
                    sx={{
                      fontSize: 60,
                      color: "text.secondary",
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tasks in progress
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Add your first task to get started
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddTask(true)}
                    sx={{ borderRadius: "24px", px: 3 }}
                  >
                    Add new task
                  </Button>
                </Paper>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {completedTasks.length > 0 ? (
                <Grid container spacing={3}>
                  {completedTasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Grow key={task.id} in={true} timeout={300}>
                        <Box>
                          <TaskCard
                            task={task}
                            boardId={board.id}
                            onDelete={handleDeleteTask}
                            onComplete={handleCompleteTask}
                            onEdit={handleEditTask}
                          />
                        </Box>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 4,
                    mt: 2,
                  }}
                >
                  <EmojiEventsIcon
                    sx={{
                      fontSize: 60,
                      color: "text.secondary",
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No completed tasks yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Tasks you complete will appear here
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setActiveTab(0)}
                    sx={{ borderRadius: "24px", px: 3 }}
                  >
                    View in-progress tasks
                  </Button>
                </Paper>
              )}
            </TabPanel>
          </Box>
        </Box>
      </Fade>

      {showAddTask && (
        <AddIssue
          show={showAddTask}
          onClose={() => setShowAddTask(false)}
          boardId={board.id}
          onAdd={handleAddTask}
        />
      )}

      {editingTask && (
        <AddIssue
          show={!!editingTask}
          onClose={() => setEditingTask(null)}
          boardId={board.id}
          onAdd={handleSaveEdit}
          initialData={editingTask}
        />
      )}
    </Box>
  );
};

// Custom TabPanel component
const TabPanel = (props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{
        display: value === index ? "block" : "none",
        width: "100%",
        transition: "opacity 0.3s ease",
        opacity: value === index ? 1 : 0,
      }}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default CreateTask;
