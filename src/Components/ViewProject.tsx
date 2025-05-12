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

// Mock data for project members with roles based on the ER diagram

// Permission indicator component
const PermissionIndicator = ({ value }: { value: boolean }) => {
  return value ? (
    <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1.2rem" }} />
  ) : (
    <CancelIcon sx={{ color: "#f44336", fontSize: "1.2rem" }} />
  );
};

// Role icon component that shows appropriate icon based on permissions
const RoleIcon = ({
  canRead,
  canWrite,
  canExec,
}: {
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
}) => {
  if (canRead && canWrite && canExec) {
    return <AdminPanelSettingsIcon sx={{ color: "#ff9800", mr: 1 }} />;
  } else if (canRead && canWrite) {
    return <EditIcon sx={{ color: "#2196f3", mr: 1 }} />;
  } else {
    return <VisibilityIcon sx={{ color: "#9c27b0", mr: 1 }} />;
  }
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
                  {
                    mockProjectMembers.filter(
                      (member) => member.project === project.name
                    ).length
                  }{" "}
                  Team Members
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Composition */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: colors.primary[400],
              height: "100%",
              boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                color={colors.greenAccent[500]}
                fontWeight="600"
                mb={2}
              >
                Team Composition
              </Typography>

              <Box
                sx={{
                  height: 250,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={project.roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {project.roleDistribution.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} member(s)`,
                        "Count",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Divider sx={{ my: 2, backgroundColor: colors.primary[300] }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {project.roleDistribution.map((role: any, index: number) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color={colors.grey[100]}>
                      {role.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={colors.grey[100]}
                      fontWeight="600"
                    >
                      {role.value} member{role.value > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Allocation */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: colors.primary[400],
              height: "100%",
              boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                color={colors.greenAccent[500]}
                fontWeight="600"
                mb={2}
              >
                Budget Allocation
              </Typography>

              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={project.budgetAllocation}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(value: number) => `$${value / 1000}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fill: colors.grey[100] }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `$${Number(value).toLocaleString()}`,
                        "Budget",
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      fill={colors.greenAccent[500]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Divider sx={{ my: 2, backgroundColor: colors.primary[300] }} />

              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color={colors.grey[100]} mb={1}>
                  Total Budget:{" "}
                  <span
                    style={{ fontWeight: 600, color: colors.greenAccent[500] }}
                  >
                    ${project.budget.toLocaleString()}
                  </span>
                </Typography>

                {project.budgetAllocation.map((item: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color={colors.grey[100]}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[100]}>
                      {((item.value / project.budget) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
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
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [currentProjectData, setCurrentProjectData] = useState<Project | null>(
    null
  );
  const [projectMembersRows, setProjectMembersRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;

      const { data: user } = await getUser(Number(userId));
      if (!user || !user.projects) return;

      const projectIds = user.projects;
      let numberProjectIds: number[] = [];
      let projectResponses: any[] = [];

      if (
        Array.isArray(projectIds) &&
        projectIds.length > 0 &&
        typeof projectIds[0] === "object" &&
        projectIds[0] !== null &&
        "projectid" in projectIds[0]
      ) {
        numberProjectIds = (projectIds as ProjectMember[]).map(
          (pm) => pm.projectId
        );
        projectResponses = await Promise.all(
          numberProjectIds.map((id) => getProject(id))
        );
      } else {
        projectResponses = await Promise.all(
          projectIds.map((id) => getProject(id as number))
        );
      }

      const validProjects = projectResponses
        .filter((p) => p.data !== null)
        .map((p) => p.data!);

      setProjectOptions(validProjects.map((p) => ({ id: p.id, name: p.name })));
    };

    fetchUserProjects();
  }, []);

  useEffect(() => {
    const fetchSelectedProject = async () => {
      if (!selectedProject) return;

      const projectEntry = projectOptions.find(
        (p) => p.name === selectedProject
      );

      console.log("project entry=", projectEntry);
      const projectId = projectEntry?.id;
      console.log("id=" + projectId);
      if (!projectId) return;

      const { data: project } = await getProject(projectId);
      console.log(project);
      console.log("project.members (raw):", project!.members);

      if (!project) return;

      setCurrentProjectData(project);

      if (!Array.isArray(project.members)) return;
      console.log("members array:", project.members);
      project.members.forEach((m, i) => {
        console.log(`member[${i}]:`, m);
      });
      const memberDetails = await Promise.all(
        project.members.map(async (member: number) => {
          const { data: memberData } = await getProjectMember(member);
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

    fetchSelectedProject();
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
        <Typography variant="body2" fontWeight="600">
          {params.value}
        </Typography>
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
    <Box>
      <DropDown
        value={selectedProject}
        onSelect={setSelectedProject}
        options={projectOptions.map((p) => p.name)}
      />
      <DataGrid
        rows={projectMembersRows}
        columns={columns}
        autoHeight
        paginationModel={{ pageSize: 10, page: 0 }}
        pageSizeOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default ViewProject;
