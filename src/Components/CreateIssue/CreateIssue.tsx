/**
 * CreateIssue.tsx
 *
 * This file defines the CreateIssue component for managing project issues.
 * It allows adding, editing, completing, and deleting issues.
 * issues are visually divided into 'In Progress' and 'Completed' sections.
 */
import React, { useState } from "react";
import { Tabs, Tab, Slide, Paper, Grow } from "@mui/material";
import { Button, Box, Typography, Grid, Fade } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Board, Issue } from "../../utils/types";
import { IssueCard } from "./IssueCard";
import { AddIssue } from "./AddIssue";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { getUser, getIssue } from "../../utils/getters.utils";
interface CreateIssuePageProps {
  board: Board;
}

// export const mockBoard: Board = {
//   id: 1,
//   name: "Project Board",
//   createdBy: "Kejsi",
//   createdById: "user-1",
//   createdAt: new Date(),
//   issues: [
//     {
//       id: 1,
//       title: "Setup Project Repository",
//       desc: "Initialize GitHub repository and push the initial commit.",
//       tagId: 1,
//       priority: 1,
//       cost: 100,
//       created: new Date("2024-04-01"),
//       completed: undefined,
//     },
//     {
//       id: 2,
//       title: "Create Database Schema",
//       desc: "Design and create tables for users, projects, and issues.",
//       tagId: 2,
//       priority: 2,
//       cost: 300,
//       created: new Date("2024-04-02"),
//       completed: undefined,
//     },
//     {
//       id: 3,
//       title: "Implement User Authentication",
//       desc: "Login, signup, password reset, and session management.",
//       tagId: 3,
//       priority: 1,
//       cost: 250,
//       created: new Date("2024-04-04"),
//       completed: new Date("2024-04-06"),
//     },
//     {
//       id: 4,
//       title: "Build Issue Tracking Dashboard",
//       desc: "Frontend UI to create, view, edit, and complete issues.",
//       tagId: 1,
//       priority: 3,
//       cost: 400,
//       created: new Date("2024-04-07"),
//       completed: undefined,
//     },
//     {
//       id: 5,
//       title: "Deploy Application",
//       desc: "Deploy backend on server and frontend on Vercel.",
//       tagId: 2,
//       priority: 2,
//       cost: 500,
//       created: new Date("2024-04-10"),
//       completed: undefined,
//     },
//   ],
// };

/**
 * CreateIssue Component
 *
 * Displays and manages a board's list of issues.
 * - Allows creating, editing, deleting, and completing issues.
 * - Supports switching issues between 'In Progress' and 'Completed' states.
 */
const CreateIssue: React.FC<CreateIssuePageProps> = ({ board }) => {
  // Import necessary components
  const { Grid } = require("@mui/material");
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadIssuesFromBackend = async () => {
      const userId = Number(localStorage.getItem("userid"));
      if (!userId) return;

      const userRes = await getUser(userId);
      if (!userRes.data || !userRes.data.issues) return;

      const issuesFetched = await Promise.all(
        userRes.data.issues.map((issueId) => getIssue(issueId))
      );

      const validIssues = issuesFetched
        .filter((res) => res.status === 200 && res.data)
        .map((res) => res.data as Issue);

      setIssues(validIssues);
    };

    loadIssuesFromBackend();
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleAddIssue = (issue: Issue) => {
    setIssues((prev) => [...prev, issue]);
  };

  const handleDeleteIssue = (IssueId: number) => {
    setIssues((prev) => prev.filter((Issue) => Issue.id !== IssueId));
  };

  const handleCompleteIssue = (IssueId: number) => {
    setIssues((previssues) =>
      previssues.map((Issue) =>
        Issue.id === IssueId
          ? { ...Issue, completed: Issue.completed ? undefined : new Date() }
          : Issue
      )
    );
  };

  const handleEditIssue = (Issue: Issue) => {
    setEditingIssue(Issue);
  };

  const handleSaveEdit = (updatedIssue: Issue) => {
    setIssues((prev) =>
      prev.map((Issue) => (Issue.id === updatedIssue.id ? updatedIssue : Issue))
    );
    setEditingIssue(null);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const inProgressissues = issues.filter((Issue) => !Issue.completed);
  const completedissues = issues.filter((Issue) => Issue.completed);

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
            onClick={() => setShowAddIssue(true)}
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
                  label={`In Progress (${inProgressissues.length})`}
                  sx={{
                    "&:first-of-type::after": {
                      width: activeTab === 0 ? "100%" : 0,
                    },
                  }}
                />
                <Tab
                  icon={<CheckCircleIcon />}
                  iconPosition="start"
                  label={`Completed (${completedissues.length})`}
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
              {inProgressissues.length > 0 ? (
                <Grid container spacing={3}>
                  {inProgressissues.map((Issue) => (
                    <Grid item xs={12} sm={6} md={4} key={Issue.id}>
                      <Grow in={true} timeout={300}>
                        <Box>
                          <IssueCard
                            issue={Issue}
                            boardId={board.id}
                            onDelete={handleDeleteIssue}
                            onComplete={handleCompleteIssue}
                            onEdit={handleEditIssue}
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
                    No issues in progress
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Add your first Issue to get started
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddIssue(true)}
                    sx={{ borderRadius: "24px", px: 3 }}
                  >
                    Add new Issue
                  </Button>
                </Paper>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {completedissues.length > 0 ? (
                <Grid container spacing={3}>
                  {completedissues.map((Issue) => (
                    <Grid item xs={12} sm={6} md={4} key={Issue.id}>
                      <Grow key={Issue.id} in={true} timeout={300}>
                        <Box>
                          <IssueCard
                            issue={Issue}
                            boardId={board.id}
                            onDelete={handleDeleteIssue}
                            onComplete={handleCompleteIssue}
                            onEdit={handleEditIssue}
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
                    No completed issues yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    issues you complete will appear here
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setActiveTab(0)}
                    sx={{ borderRadius: "24px", px: 3 }}
                  >
                    View in-progress issues
                  </Button>
                </Paper>
              )}
            </TabPanel>
          </Box>
        </Box>
      </Fade>

      {showAddIssue && (
        <AddIssue
          show={showAddIssue}
          onClose={() => setShowAddIssue(false)}
          boardId={board.id}
          onAdd={handleAddIssue}
        />
      )}

      {editingIssue && (
        <AddIssue
          show={!!editingIssue}
          onClose={() => setEditingIssue(null)}
          boardId={board.id}
          onAdd={handleSaveEdit}
          initialData={editingIssue}
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

export default CreateIssue;
