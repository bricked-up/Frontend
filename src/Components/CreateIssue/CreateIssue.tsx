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
  board?: Board;
}
export const defaultBoard: Board = {
  id: 0,
  name: "",
  createdBy: "system",
  createdById: "0",
  createdAt: new Date(),
  issues: [],
};
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
//};

/**
 * CreateIssue Component
 *
 * Displays and manages a board's list of issues.
 * - Allows creating, editing, deleting, and completing issues.
 * - Supports switching issues between 'In Progress' and 'Completed' states.
 */
const CreateIssue: React.FC<CreateIssuePageProps> = ({
  board = {
    id: 0,
    name: "",
    createdBy: "system",
    createdById: "0",
    createdAt: new Date(),
    issues: [],
  },
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadIssues = async () => {
      const userId = Number(localStorage.getItem("userid"));
      if (!userId) return;
      const { data: user } = await getUser(userId);
      if (!user?.issues) return;

      const fetched = await Promise.all(user.issues.map((id) => getIssue(id)));
      const valid = fetched
        .filter((res) => res.status === 200 && res.data)
        .map((res) => res.data as Issue);

      const savedStatus = localStorage.getItem("completedStatus");
      const overrides: Record<number, string> = savedStatus
        ? JSON.parse(savedStatus)
        : {};

      const merged = valid.map((issue) => ({
        ...issue,
        completed:
          overrides[issue.id] === "completed"
            ? new Date()
            : overrides[issue.id] === "uncompleted"
            ? undefined
            : issue.completed,
      }));

      setIssues(merged);
    };
    loadIssues();
  }, []);

  const saveCompletionState = (updated: Issue[]) => {
    const status: Record<number, string> = {};
    updated.forEach((issue) => {
      status[issue.id] = issue.completed ? "completed" : "uncompleted";
    });
    localStorage.setItem("completedStatus", JSON.stringify(status));
  };

  const handleAddIssue = (issue: Issue) =>
    setIssues((prev) => [...prev, issue]);
  const handleDeleteIssue = (id: number) =>
    setIssues((prev) => prev.filter((issue) => issue.id !== id));

  const handleCompleteIssue = (id: number) => {
    setIssues((prev) => {
      const updated = prev.map((issue) =>
        issue.id === id
          ? { ...issue, completed: issue.completed ? undefined : new Date() }
          : issue
      );
      saveCompletionState(updated);
      return updated;
    });
  };

  const handleEditIssue = (issue: Issue) => setEditingIssue(issue);
  const handleSaveEdit = (updated: Issue) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === updated.id ? updated : issue))
    );
    setEditingIssue(null);
  };

  const handleChangeTab = (_: React.SyntheticEvent, value: number) =>
    setActiveTab(value);

  const inProgress = issues.filter((issue) => !issue.completed);
  const completed = issues.filter((issue) => issue.completed);

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
          <Box sx={{ width: "100%", maxWidth: "1200px", mb: 3 }}>
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
                label={`In Progress (${inProgress.length})`}
              />
              <Tab
                icon={<CheckCircleIcon />}
                label={`Completed (${completed.length})`}
              />
            </Tabs>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
              minHeight: "200px",
              maxHeight: "calc(100vh - 240px)",
              overflowY: "auto",
              px: 1,
              py: 2,
            }}
          >
            <TabPanel value={activeTab} index={0}>
              {inProgress.length ? (
                <Grid container spacing={3}>
                  {inProgress.map((issue) => (
                    <Grid item xs={12} sm={6} md={4} key={issue.id}>
                      <Grow in timeout={300}>
                        <Box>
                          <IssueCard
                            issue={issue}
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
                <Typography>No issues in progress</Typography>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {completed.length ? (
                <Grid container spacing={3}>
                  {completed.map((issue) => (
                    <Grid item xs={12} sm={6} md={4} key={issue.id}>
                      <Grow in timeout={300}>
                        <Box>
                          <IssueCard
                            issue={issue}
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
                <Typography>No completed issues</Typography>
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
          show
          onClose={() => setEditingIssue(null)}
          boardId={board.id}
          onAdd={handleSaveEdit}
          initialData={editingIssue}
        />
      )}
    </Box>
  );
};

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => (
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
  >
    {value === index && children}
  </div>
);

export default CreateIssue;
