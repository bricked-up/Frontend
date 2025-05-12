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
import { GetProjectResult, Project, ProjectMember } from "../utils/types";
import { getUser, getProject, getProjectMember } from "../utils/getters.utils";
import { a2 } from "framer-motion/dist/types.d-DDSxwf0n";

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
            : colors.primary[400],
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
              backgroundColor: colors.primary[400],
              height: "100%",
              boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color={colors.greenAccent[500]}
                fontWeight="600"
                mb={2}
              >
                Project Details
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountTreeIcon
                  sx={{ color: colors.greenAccent[500], mr: 1 }}
                />
                <Typography variant="body2" color={colors.grey[100]}>
                  Organization ID: {project.orgid}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoneyIcon
                  sx={{ color: colors.greenAccent[500], mr: 1 }}
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
              backgroundColor: colors.primary[400],
              height: "100%",
              boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color={colors.greenAccent[500]}
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
                    color={colors.greenAccent[500]}
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
                  color={colors.greenAccent[500]}
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

  useEffect(() => {
    const fetchUserProjects = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;
      const { data: user } = await getUser(Number(userId));
      if (!user?.projects) return;

      const projectResponses = await Promise.all(
        user.projects.map((pid: any) =>
          getProject(typeof pid === "object" ? pid.projectId : pid)
        )
      );

      const validProjects = projectResponses
        .filter((p) => p.data !== null)
        .map((p) => p.data!);
      setProjectOptions(validProjects.map((p) => ({ id: p.id, name: p.name })));
    };
    fetchUserProjects();
  }, []);

  useEffect(() => {
    const fetchSelectedProject = async () => {
      const projectEntry = projectOptions.find(
        (p) => p.name === selectedProject
      );
      if (!projectEntry) return;
      const { data: project } = await getProject(projectEntry.id);
      if (!project || !Array.isArray(project.members)) return;

      setCurrentProjectData(project);

      const memberDetails = await Promise.all(
        project.members.map(async (memberId: number) => {
          const { data: memberData } = await getProjectMember(memberId);
          return memberData
            ? {
                id: memberData.id,
                userid: memberData.userId,
                memberid: memberData.id,
                roleName: Array.isArray(memberData.roles)
                  ? memberData.roles
                      .map((r) => (typeof r === "object" ? r.name : r))
                      .join(", ")
                  : "",
                can_read: memberData.canRead,
                can_write: memberData.canWrite,
                can_exec: memberData.canExec,
                username: memberData.userId.toString(),
              }
            : null;
        })
      );

      setProjectMembersRows(memberDetails.filter(Boolean));
    };
    if (selectedProject) fetchSelectedProject();
  }, [selectedProject]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      width: 0,
      minWidth: 0,
      maxWidth: 0,
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
    { field: "memberid", headerName: "Member ID", flex: 1 },
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
  ];

  return (
    <Box
      sx={{ backgroundColor: colors.primary[400], minHeight: "100vh", py: 3 }}
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
            backgroundColor: colors.primary[900],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h6" color={colors.grey[100]}>
              Filter by Project:
            </Typography>
            <DropDown
              value={selectedProject}
              onSelect={setSelectedProject}
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
              columns: { columnVisibilityModel: { id: false } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              border: "none",
              color: colors.grey[100],
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.primary[500],
                color: colors.grey[100],
                borderBottom: `1px solid ${colors.primary[300]}`,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${colors.primary[300]}`,
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
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
              backgroundColor: colors.primary[900],
            }}
          >
            <ProjectDetails project={currentProjectData} />
          </Paper>
        )}
      </Box>
    </Box>
  );
};
export default ViewProject;
