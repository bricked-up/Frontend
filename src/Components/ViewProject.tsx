// WORKING CODE THAT LOOKS LIKE SHIT:
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Chip,
  IconButton, // Added
  CircularProgress, // Added for loading state
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { tokens } from "../theme";
import Header from "./Header";
import DropDown from "../pages/DropDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteIcon from "@mui/icons-material/Delete"; // Added
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GetProjectResult, Project, ProjectMember } from "../utils/types"; // ProjectMember is used
import { getUser, getProject, getProjectMember } from "../utils/getters.utils";
import { removeProjectMember } from "../utils/post.utils"; // Added
import { Result as PostResult } from "../utils/post.utils"; // Added type for the result of removeProjectMember

const PermissionIndicator = ({ value }: { value: boolean }) => {
  return value ? (
    <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1.2rem" }} />
  ) : (
    <CancelIcon sx={{ color: "#f44336", fontSize: "1.2rem" }} />
  );
};

const RoleIcon = ({
  canRead,
  canWrite,
  canExec,
}: {
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
}) => {
  if (canRead && canWrite && canExec)
    return <AdminPanelSettingsIcon sx={{ color: "#ff9800", mr: 1 }} />;
  if (canRead && canWrite) return <EditIcon sx={{ color: "#2196f3", mr: 1 }} />;
  return <VisibilityIcon sx={{ color: "#9c27b0", mr: 1 }} />;
};

// This type guard seems unused in the provided snippet, but keeping it as it was there.
function isProjectMember(item: any): item is ProjectMember {
  return (
    typeof item === "object" &&
    item !== null &&
    "projectId" in item &&
    "id" in item
  );
}

// Custom component for project details
const ProjectDetails = ({ project }: { project: any }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Animation for the component
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, [project]);

  if (!project) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            color:
              theme.palette.mode === "light"
                ? colors.grey[700]
                : colors.grey[100],
          }}
        >
          Select a project to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[900]
            : colors.primary[400], // This was colors.primary[400], assuming it's for dark mode, changed ProjectDetails background
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
          {project.name} Overview
        </Typography>
        <Chip
          label={project.archived ? "Archived" : "Active"}
          color={project.archived ? "default" : "primary"}
          sx={{ borderRadius: "4px" }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Project Basic Info */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: colors.primary[400], // Assuming this should be consistent with the outer box in dark mode
              height: "100%",
              boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color={colors.blueAccent[500]}
                fontWeight="600"
                mb={2}
              >
                Project Details
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountTreeIcon
                  sx={{ color: colors.blueAccent[500], mr: 1 }}
                />
                <Typography variant="body2" color={colors.grey[100]}>
                  Organization ID: {project.orgid}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoneyIcon
                  sx={{ color: colors.blueAccent[500], mr: 1 }}
                />
                <Typography variant="body2" color={colors.grey[100]}>
                  Budget: ${project.budget.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventNoteIcon sx={{ color: colors.greenAccent[500], mr: 1 }} />
                <Typography variant="body2" color={colors.grey[100]}>
                  Timeline: {new Date(project.startDate).toLocaleDateString()} -{" "}
                  {new Date(project.endDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Typography variant="body2" color={colors.grey[300]} mb={2}>
                {project.charter}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {project.tags.map((tag: string, index: number) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: colors.blueAccent[700],
                      color: colors.grey[100],
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Progress */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: colors.primary[400], // Assuming this should be consistent
              height: "100%",
              boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color={colors.blueAccent[500]}
                fontWeight="600"
                mb={2}
              >
                Project Progress
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color={colors.grey[100]}>
                    Overall Completion
                  </Typography>
                  <Typography
                    variant="body2"
                    color={colors.blueAccent[500]}
                    fontWeight="600"
                  >
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.primary[300],
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        project.progress < 30
                          ? colors.redAccent[500]
                          : project.progress < 70
                            ? colors.blueAccent[500]
                            : colors.greenAccent[500],
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color={colors.grey[100]}>
                  Issues Completed
                </Typography>
                <Typography
                  variant="body2"
                  color={colors.blueAccent[500]}
                  fontWeight="600"
                >
                  {project.completedIssues}/{project.issueCount}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(project.completedIssues / project.issueCount) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 3,
                  backgroundColor: colors.primary[300],
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: colors.blueAccent[500],
                    borderRadius: 5,
                  },
                }}
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <GroupsIcon
                  sx={{
                    fontSize: "3rem",
                    color: colors.blueAccent[500],
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body1"
                  color={colors.grey[100]}
                  fontWeight="600"
                >
                  {project.members?.length ?? 0} Team Members
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining sections unchanged... */}
        {/* Placeholder for Pie Chart & Bar Chart if they were meant to be here */}
        {/* Example from original thought process (if they are part of ProjectDetails)
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%", boxShadow: `0 4px 8px rgba(0,0,0,0.2)`}}>
            <CardContent>
              <Typography variant="h6" color={colors.blueAccent[500]} fontWeight="600" mb={2}>Task Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[{name: 'Group A', value: 400}, {name: 'Group B', value: 300}]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                    {[{name: 'Group A', value: 400}, {name: 'Group B', value: 300}].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
           <Card sx={{ backgroundColor: colors.primary[400], height: "100%", boxShadow: `0 4px 8px rgba(0,0,0,0.2)` }}>
            <CardContent>
               <Typography variant="h6" color={colors.blueAccent[500]} fontWeight="600" mb={2}>Budget Usage</Typography>
               <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[{name: 'Allocated', uv: project.budget}, {name: 'Spent', uv: project.budget * (project.progress/100)}]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uv" fill={colors.greenAccent[500]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        */}
      </Grid>
    </Box>
  );
};

const ViewProject = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [projectOptions, setProjectOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [currentProjectData, setCurrentProjectData] = useState<Project | null>(
    null
  );
  const [projectMembersRows, setProjectMembersRows] = useState<any[]>([]);
  const [isDeletingMember, setIsDeletingMember] = useState<number | null>(null); // Added: track which member is being deleted

  useEffect(() => {
    const fetchUserProjects = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;
      const { data: user } = await getUser(Number(userId));
      if (!user?.projects) return;

      const projectResponses = await Promise.all(
        user.projects.map((pid: any) => // pid can be number or { projectId: number }
          getProject(typeof pid === "object" && pid !== null && 'projectId' in pid ? pid.projectId : pid)
        )
      );
      
      const validProjects = projectResponses
        .filter((p): p is GetProjectResult & { data: Project } => p.data !== null) // Type assertion for filtering
        .map((p) => p.data);
      setProjectOptions(validProjects.map((p) => ({ id: p.id, name: p.name })));
    };
    fetchUserProjects();
  }, []);

  useEffect(() => {
    const fetchSelectedProject = async () => {
      if (!selectedProject) { // Added guard to prevent running if no project is selected
        setCurrentProjectData(null);
        setProjectMembersRows([]);
        return;
      }
      const projectEntry = projectOptions.find(
        (p) => p.name === selectedProject
      );
      if (!projectEntry) return;
      const { data: project } = await getProject(projectEntry.id);
       // Ensure project and project.members are valid before proceeding
      if (!project || !Array.isArray(project.members)) {
        setCurrentProjectData(project); // Set project data even if members array is missing/invalid for details view
        setProjectMembersRows([]); // Clear members rows
        console.warn("Project data fetched, but members array is missing or invalid:", project);
        return;
      }

      setCurrentProjectData(project);

      const memberDetailsPromises = project.members.map(async (memberIdOrObject: number | { id: number, userId: number, projectId: number, /* other ProjectMember fields */ }) => {
        let projectMemberId: number;
        let userIdFromMemberObject: number | undefined;

        if (typeof memberIdOrObject === 'number') {
            // This case assumes memberIdOrObject is directly the projectMemberId
            // This might need adjustment if 'project.members' contains user IDs instead of ProjectMember IDs
            // For now, assuming it's ProjectMember ID as per typical DB relation linking tables
            projectMemberId = memberIdOrObject;
        } else if (typeof memberIdOrObject === 'object' && memberIdOrObject !== null && 'id' in memberIdOrObject) {
            // If project.members contains full ProjectMember objects
            projectMemberId = memberIdOrObject.id;
            userIdFromMemberObject = memberIdOrObject.userId;
        } else {
            console.error("Invalid member identifier in project.members:", memberIdOrObject);
            return null; // Skip invalid entries
        }
        
        const { data: memberData } = await getProjectMember(projectMemberId);
        if (!memberData) return null;

        const userIdToFetch = userIdFromMemberObject ?? memberData.userId;
        const { data: userInfo } = await getUser(userIdToFetch);

        return {
          id: memberData.id, // This is ProjectMember.id, used as unique row id for DataGrid
          userid: memberData.userId,
          memberid: memberData.id, // This is ProjectMember.id, specific for removal
          username: userInfo?.name || `User ${memberData.userId}`,
          roleName:
            memberData.canRead && memberData.canWrite && memberData.canExec
              ? "Administrator"
              : memberData.canRead && memberData.canWrite
                ? "Developer"
                : memberData.canRead
                  ? "Viewer"
                  : "Viewer", // Default to Viewer if no specific role matches
          can_read: memberData.canRead ?? false, // Provide default if undefined
          can_write: memberData.canWrite ?? false, // Provide default if undefined
          can_exec: memberData.canExec ?? false, // Provide default if undefined
        };
      });

      const memberDetails = (await Promise.all(memberDetailsPromises)).filter(Boolean);
      setProjectMembersRows(memberDetails as any[]); // Filtered out nulls, so assertion is safer
    };

    if (selectedProject) fetchSelectedProject();
    else { // Clear data if no project is selected
        setCurrentProjectData(null);
        setProjectMembersRows([]);
    }
  }, [selectedProject, projectOptions]); // Added projectOptions to dependency array


  const handleRemoveMember = async (projectMemberId: number) => {
    const sessionIdString = localStorage.getItem("sessionid");
    if (!sessionIdString) {
      alert("Session not found. Please log in again.");
      // Potentially redirect to login or handle more gracefully
      return;
    }
    const sessionId = Number(sessionIdString);
    if (isNaN(sessionId)) {
        alert("Invalid session ID found. Please log in again.");
        return;
    }

    setIsDeletingMember(projectMemberId); // Set loading for this specific member
    try {
      const result: PostResult = await removeProjectMember(sessionId, projectMemberId);
      if (result.status === 200 || result.status === 204) { // Assuming 200 or 204 for successful deletion
        setProjectMembersRows((prevRows) =>
          prevRows.filter((row) => row.memberid !== projectMemberId)
        );
        // Optionally, refetch project data if member count on ProjectDetails needs update and isn't reactive
        // For now, just updating the local list.
        alert("Member removed successfully.");
      } else {
        console.error("Failed to remove member:", result.error, "Status:", result.status);
        alert(`Failed to remove member: ${result.error || `Status ${result.status}`}`);
      }
    } catch (error) {
      console.error("Error during member removal:", error);
      alert("An unexpected error occurred while removing the member.");
    } finally {
      setIsDeletingMember(null); // Clear loading state
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      width: 0, // These were 0, making them very small if not invisible.
      minWidth: 0, // If they should be hidden, use columnVisibilityModel
      maxWidth: 0, // Or set width to a small number if it's for debug but not primary display
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 1.2,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value}</Typography>
      ),
    },
    { field: "userid", headerName: "User ID", flex: 1 },
    { field: "memberid", headerName: "Member ID", flex: 1 }, // This is ProjectMember.id
    {
      field: "roleName",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box
            sx={{
              backgroundColor: colors.blueAccent[700],
              p: "5px 10px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RoleIcon
              canRead={row.can_read}
              canWrite={row.can_write}
              canExec={row.can_exec}
            />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        );
      },
    },
    {
      field: "can_read",
      headerName: "Read Access",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <PermissionIndicator value={Boolean(params.value)} />
      ),
    },
    {
      field: "can_write",
      headerName: "Write Access",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <PermissionIndicator value={Boolean(params.value)} />
      ),
    },
    {
      field: "can_exec",
      headerName: "Execute Access",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <PermissionIndicator value={Boolean(params.value)} />
      ),
    },
    { // Added Action column
      field: "actions",
      headerName: "Remove",
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const memberId = params.row.memberid; // This is ProjectMember.id
        return (
          <IconButton
            onClick={() => handleRemoveMember(memberId)}
            disabled={isDeletingMember === memberId}
            color="error" // Use theme's error color for delete
            size="small"
          >
            {isDeletingMember === memberId ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400], // This was theme.palette.mode === "light" ? colors.primary[900] : colors.primary[400]
                                            // Changed to always be colors.primary[400] like the original code.
        minHeight: "100vh", // Changed from height to minHeight for better responsiveness with content
        overflowY: "auto",
        py: 3,
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Header
          title="Project Management"
          subtitle="Team Members and Project Information"
        />
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: colors.primary[900], // This was dynamic, now fixed to colors.primary[900] as per original
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h6" color={colors.grey[100]}>
              Filter by Project:
            </Typography>
            <DropDown
              value={selectedProject}
              onSelect={(value) => {
                setSelectedProject(value);
                // When project selection changes, clear previous project's member details immediately
                // The useEffect for fetchSelectedProject will then load the new ones.
                // This prevents showing old members briefly for a new project.
                setProjectMembersRows([]); 
                setCurrentProjectData(null);
              }}
              options={projectOptions.map((p) => p.name)}
            />
          </Box>
          <DataGrid
            rows={projectMembersRows}
            columns={columns}
            autoHeight
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              columns: { columnVisibilityModel: { id: false } }, // id column is hidden by default
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              border: "none",
              color: colors.grey[100],
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.primary[500], // This was colors.blueAccent[700], changed to primary[500] as per original
                color: colors.grey[100],
                borderBottom: `1px solid ${colors.primary[300]}`,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${colors.primary[300]}`,
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400], // This was colors.primary[400]
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${colors.primary[300]}`,
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: colors.blueAccent[800],
                "& .MuiButton-root": { color: colors.grey[100] },
              },
            }}
          />
        </Paper>

        {currentProjectData && (
          <Paper
            elevation={3}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: colors.primary[900], // Consistent with the DataGrid paper
            }}
          >
            {/* The ProjectDetails component was inside another Box with dynamic background,
                this Paper now serves as its direct styled container.
                Original ProjectDetails had its own animated Box with background colors.primary[400] (dark mode)
                or colors.primary[900] (light mode).
                The structure here is Paper (colors.primary[900]) -> ProjectDetails (which has its own Box with background)
            */}
            <ProjectDetails project={currentProjectData} />
          </Paper>
        )}
      </Box>
    </Box>
  );
};
export default ViewProject;