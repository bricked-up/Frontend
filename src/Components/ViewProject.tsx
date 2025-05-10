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
import { Issue, Project, Tag } from "../utils/types";

// Mock data for project members with roles based on the ER diagram
const mockProjectMembers = [
  {
    id: 1,
    username: "John Doe",
    userid: "jdoe123",
    memberid: "PM001",
    roleName: "Administrator",
    can_read: true,
    can_write: true,
    can_exec: true,
    project: "Project Alpha",
  },
  {
    id: 2,
    username: "Jane Smith",
    userid: "jsmith456",
    memberid: "PM002",
    roleName: "Developer",
    can_read: true,
    can_write: true,
    can_exec: false,
    project: "Project Alpha",
  },
  {
    id: 3,
    username: "Mike Johnson",
    userid: "mjohnson789",
    memberid: "PM003",
    roleName: "Viewer",
    can_read: true,
    can_write: false,
    can_exec: false,
    project: "Project Alpha",
  },
  {
    id: 4,
    username: "Sarah Williams",
    userid: "swilliams101",
    memberid: "PM004",
    roleName: "Developer",
    can_read: true,
    can_write: true,
    can_exec: false,
    project: "Project Beta",
  },
  {
    id: 5,
    username: "Robert Chen",
    userid: "rchen202",
    memberid: "PM005",
    roleName: "Administrator",
    can_read: true,
    can_write: true,
    can_exec: true,
    project: "Project Beta",
  },
  {
    id: 6,
    username: "Emily Davis",
    userid: "edavis303",
    memberid: "PM006",
    roleName: "Tester",
    can_read: true,
    can_write: false,
    can_exec: true,
    project: "Project Beta",
  },
  {
    id: 7,
    username: "Alex Thompson",
    userid: "athompson404",
    memberid: "PM007",
    roleName: "Designer",
    can_read: true,
    can_write: true,
    can_exec: false,
    project: "Project Gamma",
  },
  {
    id: 8,
    username: "Lisa Garcia",
    userid: "lgarcia505",
    memberid: "PM008",
    roleName: "Viewer",
    can_read: true,
    can_write: false,
    can_exec: false,
    project: "Project Gamma",
  },
  {
    id: 9,
    username: "David Taylor",
    userid: "dtaylor606",
    memberid: "PM009",
    roleName: "Administrator",
    can_read: true,
    can_write: true,
    can_exec: true,
    project: "Project Gamma",
  },
  {
    id: 10,
    username: "Olivia Wilson",
    userid: "owilson707",
    memberid: "PM010",
    roleName: "Developer",
    can_read: true,
    can_write: true,
    can_exec: false,
    project: "Project Delta",
  },
];

const mockTags: Tag[] = [
  {
    id: 1,
    projectId: 1,
    name: "CRM",
    color: "magenta",
  },
  {
    id: 2,
    projectId: 1,
    name: "Enterprise",
    color: "blue",
  },
  {
    id: 3,
    projectId: 2,
    name: "Customer Engagement",
    color: "white",
  },
];

// Mock data for projects based on the ER diagram
const mockProjects: Project[] = [
  {
    id: 1,
    name: "Project Alpha",
    orgId: 443,
    budget: 250000,
    charter: "Develop a new CRM system",
    archived: false,
    tags: mockTags,
  },
  {
    id: 2,
    name: "Project Beta",
    orgId: 364,
    budget: 175000,
    charter: "Mobile app for customer engagement",
    archived: false,
    tags: mockTags,
  },
  {
    id: 3,
    name: "Project Gamma",
    orgId: 876,
    budget: 320000,
    charter: "Enterprise data warehouse implementation",
    archived: false,
    tags: mockTags,
  },
  {
    id: 4,
    name: "Project Delta",
    orgId: 273,
    budget: 120000,
    charter: "Internal productivity tools suite",
    archived: true,
    tags: mockTags,
  },
];

const mockIssues: Issue[] = [
  {
    id: 1,
    title: "Bug A",
    desc: "boombayah",
    cost: 5,
    priority: 2,
    created: new Date(),
    completed: null,
  },
  {
    id: 2,
    title: "Bug B",
    desc: "i want to kms",
    cost: 3,
    priority: 1,
    created: new Date(),
    completed: new Date(),
  },
];

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

  const [selectedProject, setSelectedProject] = useState("");
  const [currentProjectData, setCurrentProjectData] = useState<any>(null);

  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (selectedProject) {
      const projectData = mockProjects.find((p) => p.name === selectedProject);
      setCurrentProjectData(projectData);

      if (projectData) {
        const filteredIssues = mockIssues.filter(
          (issue) => issue.projectId === projectData.id
        );
        setIssues(filteredIssues);
      } else {
        setIssues([]);
      }
    } else {
      setCurrentProjectData(null);
      setIssues([]);
    }
  }, [selectedProject]);

  // Update current project data when selection changes
  useEffect(() => {
    if (selectedProject) {
      const projectData = mockProjects.find((p) => p.name === selectedProject);
      setCurrentProjectData(projectData);
    } else {
      setCurrentProjectData(null);
    }
  }, [selectedProject]);

  // Define columns based on the ER diagram
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
      renderCell: (params: GridRenderCellParams) => {
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
      renderCell: (params: GridRenderCellParams) => (
        <PermissionIndicator value={Boolean(params.value)} />
      ),
    },
    {
      field: "can_write",
      headerName: "Write Access",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <PermissionIndicator value={Boolean(params.value)} />
      ),
    },
    {
      field: "can_exec",
      headerName: "Execute Access",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <PermissionIndicator value={Boolean(params.value)} />
      ),
    },
  ];

  const filteredRows = selectedProject
    ? mockProjectMembers.filter((row) => row.project === selectedProject)
    : mockProjectMembers;

  // Create unique project options without using Set spreading
  const getUniqueProjects = () => {
    const projects = [""];
    const projectSet = new Set<string>();

    mockProjectMembers.forEach((member) => {
      if (!projectSet.has(member.project)) {
        projectSet.add(member.project);
        projects.push(member.project);
      }
    });

    return projects;
  };

  const projectOptions = getUniqueProjects();
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[400]
            : colors.primary[500],
        color: colors.grey[100],
      }}
    >
      <Box
        sx={{
          minHeight: "100%",
          overflowY: "auto",
          paddingTop: "64px",
          backgroundColor:
            theme.palette.mode === "light"
              ? "colors.primary[900]"
              : colors.primary[400],
          p: { xs: 2, sm: 3, md: 4 },
          boxSizing: "border-box",
        }}
      >
        <Header
          title="Project Management"
          subtitle="Team Members and Project Information"
        />

        <Paper
          elevation={3}
          sx={{
            m: { xs: "20px 0 0 0", md: "30px 0 0 0" },
            height: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor:
              theme.palette.mode === "light"
                ? colors.primary[900]
                : colors.primary[400],
            color: colors.grey[100],
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Dropdown and Title */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ mr: 2, color: colors.grey[100] }}>
                Filter by Project:
              </Typography>
              <DropDown
                value={selectedProject}
                onSelect={setSelectedProject}
                options={projectOptions}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: colors.grey[100],
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "1.2rem",
              }}
            >
              Project Members and Roles
            </Typography>
          </Box>

          {/* Legend for role icons */}
          <Box
            sx={{
              px: 2,
              pb: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AdminPanelSettingsIcon sx={{ color: "#ff9800", mr: 1 }} />
              <Typography variant="body2" color={colors.grey[100]}>
                Full Access (R/W/E)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EditIcon sx={{ color: "#2196f3", mr: 1 }} />
              <Typography variant="body2" color={colors.grey[100]}>
                Editor (R/W)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <VisibilityIcon sx={{ color: "#9c27b0", mr: 1 }} />
              <Typography variant="body2" color={colors.grey[100]}>
                Viewer (R only)
              </Typography>
            </Box>
          </Box>

          {/* DataGrid Table */}
          <Box sx={{ height: "65vh", width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                columns: {
                  columnVisibilityModel: {
                    id: false,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              sx={{
                border: "none",
                color: colors.grey[100],
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? colors.primary[300]
                      : colors.primary[500],
                  color: colors.grey[100],
                  borderBottom: `1px solid ${colors.primary[300]}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.85rem",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${colors.primary[300]}`,
                  padding: "10px 15px",
                  fontSize: "0.9rem",
                  "&:focus, &:focus-within": { outline: "none" },
                },
                "& .MuiDataGrid-row": {
                  transition: "background-color 0.2s ease",
                  cursor: "default",
                },
                "& .MuiDataGrid-root": {
                  "--DataGrid-row-hoveredBackground":
                    theme.palette.mode === "light"
                      ? colors.primary[100]
                      : colors.primary[800],
                },

                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: `1px solid ${colors.primary[300]}`,
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                },
                "& .MuiDataGrid-toolbarContainer": {
                  padding: "8px 16px",
                  backgroundColor: colors.blueAccent[800],
                  "& .MuiButton-root": {
                    color: colors.grey[100],
                  },
                },
              }}
            />
          </Box>
        </Paper>

        {/* Project Details Section */}
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            mb: 4,
            p: 3,
            backgroundColor:
              theme.palette.mode === "light"
                ? colors.primary[900]
                : colors.primary[400],
            color: colors.grey[100],
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ProjectDetails project={currentProjectData} />
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewProject;
