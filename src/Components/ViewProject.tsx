// src/Components/ViewProject.tsx
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
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { tokens } from "../theme";
import Header from "./Header";
import DropDown from "../pages/DropDown"; // Using the DropDown from pages

// Recharts imports
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

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import {
  getProject,
  getUser,
  getProjectRole,
  getUserProjects, // Using the new getter
} from "../utils/getters.utils";
import {
  Project,
  User,
  Issue,
  Tag,
  ProjectMember,
  ProjectRole as ProjectRoleType, // Alias to avoid naming conflicts
} from "../utils/types";
import { useUser as useAuthUser } from '../hooks/UserContext'; // To get current logged-in user ID

// Interface for the enriched member data for the DataGrid
interface EnrichedProjectMember {
  id: ProjectMember["id"]; // ProjectMember ID from linking table
  username: string; // From User.displayName or User.name
  userId: User["id"]; // From User.id
  memberId: ProjectMember["id"]; // Aliased ProjectMember ID
  roleName: string; // Derived from ProjectMember.roles
  canRead?: boolean; // Optional as per ProjectMember type
  canWrite?: boolean; // Optional as per ProjectMember type
  canExec?: boolean; // Optional as per ProjectMember type
  project: Project["name"]; // Name of the current project
}

// Interface for role distribution chart
interface RoleDistributionItem {
  name: string;
  value: number;
}

// Interface for budget allocation chart (placeholder)
interface BudgetAllocationItem {
    name: string;
    value: number;
}

// Permission indicator component
const PermissionIndicator = ({ value }: { value: boolean | undefined }) => (
  value ? <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1.2rem" }} /> : <CancelIcon sx={{ color: "#f44336", fontSize: "1.2rem" }} />
);

// Role icon component
const RoleIconDisplay = ({ canRead, canWrite, canExec }: { canRead?: boolean; canWrite?: boolean; canExec?: boolean; }) => {
  if (canRead && canWrite && canExec) return <AdminPanelSettingsIcon sx={{ color: "#ff9800", mr: 1 }} />;
  if (canRead && canWrite) return <EditIcon sx={{ color: "#2196f3", mr: 1 }} />;
  if (canRead) return <VisibilityIcon sx={{ color: "#9c27b0", mr: 1 }} />;
  return <VisibilityIcon sx={{ color: "#9e9e9e", mr: 1, opacity: 0.7 }} />;
};

// ProjectDetails sub-component
const ProjectDetails = ({ project, enrichedMembersCount, projectProgressCalculated, completedIssuesCount, totalIssuesCount, roleDistributionChartData }: { project: Project | null; enrichedMembersCount: number; projectProgressCalculated: number; completedIssuesCount: number; totalIssuesCount: number; roleDistributionChartData: RoleDistributionItem[]; }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (project) {
      const timer = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setFadeIn(false);
    }
  }, [project]);

  if (!project) {
    return <Box sx={{ p: 3, textAlign: "center" }}><Typography variant="h6" color={colors.grey[300]}>Select a project from the dropdown to view its details.</Typography></Box>;
  }

  const PIE_CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#AF19FF"];
  const budgetAllocationData: BudgetAllocationItem[] = project.budget ? [{ name: "Total Budget", value: project.budget }] : [{ name: "Data N/A", value: 0 }];
  const progressToDisplay = projectProgressCalculated;

  return (
    <Box sx={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>{project.name} Overview</Typography>
        <Chip label={project.archived ? "Archived" : "Active"} color={project.archived ? "default" : "success"} sx={{ borderRadius: "4px" }} />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%", boxShadow: `0 4px 8px rgba(0,0,0,0.2)` }}>
            <CardContent>
              <Typography variant="h6" color={colors.greenAccent[500]} fontWeight="600" mb={2}>Project Details</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}><AccountTreeIcon sx={{ color: colors.greenAccent[500], mr: 1 }} /><Typography variant="body2" color={colors.grey[100]}>Org ID: {project.orgId}</Typography></Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}><AttachMoneyIcon sx={{ color: colors.greenAccent[500], mr: 1 }} /><Typography variant="body2" color={colors.grey[100]}>Budget: ${project.budget.toLocaleString()}</Typography></Box>
              <Typography variant="body2" color={colors.grey[300]} mb={2} sx={{ fontStyle: 'italic' }}>{project.charter}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {project.tags?.map((tag: Tag) => (
                  <Chip key={tag.id} label={tag.name} size="small" sx={{ backgroundColor: tag.color || colors.blueAccent[700], color: theme.palette.getContrastText(tag.color || colors.blueAccent[700]) }}/>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%", boxShadow: `0 4px 8px rgba(0,0,0,0.2)` }}>
            <CardContent>
              <Typography variant="h6" color={colors.greenAccent[500]} fontWeight="600" mb={2}>Project Progress</Typography>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography variant="body2" color={colors.grey[100]}>Overall Completion</Typography><Typography variant="body2" color={colors.greenAccent[500]} fontWeight="600">{progressToDisplay.toFixed(1)}%</Typography></Box>
                <LinearProgress variant="determinate" value={progressToDisplay} sx={{ height: 10, borderRadius: 5, backgroundColor: colors.primary[300], "& .MuiLinearProgress-bar": { backgroundColor: progressToDisplay < 30 ? colors.redAccent[500] : progressToDisplay < 70 ? colors.blueAccent[500] : colors.greenAccent[500], borderRadius: 5 }}} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography variant="body2" color={colors.grey[100]}>Issues Completed</Typography><Typography variant="body2" color={colors.greenAccent[500]} fontWeight="600">{completedIssuesCount}/{totalIssuesCount}</Typography></Box>
              <LinearProgress variant="determinate" value={totalIssuesCount > 0 ? (completedIssuesCount / totalIssuesCount) * 100 : 0} sx={{ height: 10, borderRadius: 5, mb: 3, backgroundColor: colors.primary[300], "& .MuiLinearProgress-bar": { backgroundColor: colors.blueAccent[500], borderRadius: 5 } }} />
              <Box sx={{ textAlign: "center", mt: 2 }}><GroupsIcon sx={{ fontSize: "3rem", color: colors.blueAccent[500], mb: 1 }} /><Typography variant="body1" color={colors.grey[100]} fontWeight="600">{enrichedMembersCount} Team Members</Typography></Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%", boxShadow: `0 4px 8px rgba(0,0,0,0.2)`, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" color={colors.greenAccent[500]} fontWeight="600" mb={2}>Team Composition</Typography>
              {roleDistributionChartData.length > 0 ? (
                <>
                  <Box sx={{ height: 250, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={roleDistributionChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {roleDistributionChartData.map((_entry: any, index: number) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} member(s)`, "Count"]} /><Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Divider sx={{ my: 2, backgroundColor: colors.primary[300] }} />
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {roleDistributionChartData.map((role: RoleDistributionItem, index: number) => (<Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="body2" color={colors.grey[100]}>{role.name}</Typography><Typography variant="body2" color={colors.grey[100]} fontWeight="600">{role.value} member{role.value > 1 ? "s" : ""}</Typography></Box>))}
                  </Box>
                </>
              ) : (<Typography variant="body2" color={colors.grey[300]} textAlign="center">Role distribution data not available.</Typography>)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%", boxShadow: `0 4px 8px rgba(0,0,0,0.2)`, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" color={colors.greenAccent[500]} fontWeight="600" mb={2}>Budget Allocation</Typography>
              <Typography variant="body2" color={colors.grey[300]} sx={{ textAlign: 'center', my: 2 }}>Detailed budget allocation data is not available.</Typography>
              <Box sx={{ height: 250, opacity: 0.5 }}>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={budgetAllocationData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><XAxis type="number" tickFormatter={(value: number) => `$${value / 1000}k`} /><YAxis type="category" dataKey="name" width={100} tick={{ fill: colors.grey[100] }} /><Tooltip formatter={(value: number) => [`$${Number(value).toLocaleString()}`, "Budget"]} /><Bar dataKey="value" fill={colors.greenAccent[500]} barSize={20} /></BarChart></ResponsiveContainer>
              </Box>
              <Divider sx={{ my: 2, backgroundColor: colors.primary[300] }} />
              <Box sx={{ mt: 1 }}><Typography variant="body2" color={colors.grey[100]} mb={1}>Total Budget: <span style={{ fontWeight: 600, color: colors.greenAccent[500] }}>${project.budget.toLocaleString()}</span></Typography></Box>
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
  const navigate = useNavigate();
  const location = useLocation();
  const { user: loggedInUser } = useAuthUser();

  const [allUserProjects, setAllUserProjects] = useState<Project[]>([]);
  const [currentProjectDetail, setCurrentProjectDetail] = useState<Project | null>(null);
  const [enrichedMembersList, setEnrichedMembersList] = useState<EnrichedProjectMember[]>([]);
  const [selectedProjectNameState, setSelectedProjectNameState] = useState<string>("");

  const [isLoadingProjectsList, setIsLoadingProjectsList] = useState<boolean>(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetUserIdForProjects, setTargetUserIdForProjects] = useState<number | null>(null);

  const fetchAndSetSingleProjectDetails = useCallback(async (projectId: number, projectListContext: Project[]) => {
    setIsLoadingDetails(true);
    // Don't clear global error message here, only detail-specific if needed
    // setErrorMessage(null); 

    const projectToLoad = projectListContext.find(p => p.id === projectId);
    if (!projectToLoad) {
        setErrorMessage(`Project with ID ${projectId} not found in the current user's project list.`);
        setCurrentProjectDetail(null);
        setEnrichedMembersList([]);
        setIsLoadingDetails(false);
        return;
    }
    
    try {
      const projectResult = await getProject(projectId);
      if (projectResult.status !== 200 || !projectResult.data) {
        throw new Error(projectResult.error || `Failed to fetch project (ID: ${projectId}, status ${projectResult.status})`);
      }
      setCurrentProjectDetail(projectResult.data);
      if (projectResult.data.name !== selectedProjectNameState) {
        setSelectedProjectNameState(projectResult.data.name);
      }

      const membersFromProject = projectResult.data.members;
      if (membersFromProject && membersFromProject.length > 0) {
        const enrichedPromises = membersFromProject.map(async (member: ProjectMember) => {
          try {
            const userResult = await getUser(member.userId);
            const userDetails = (userResult.status === 200 && userResult.data) ? userResult.data : null;
            let roleName = "N/A";
            const firstRoleInfo = member.roles?.[0];
            if (firstRoleInfo) {
              if (typeof firstRoleInfo === 'number') {
                const roleResult = await getProjectRole(firstRoleInfo);
                if (roleResult.status === 200 && roleResult.data) roleName = roleResult.data.name;
                else console.warn(`Could not fetch role name for ID ${firstRoleInfo}`);
              } else { roleName = (firstRoleInfo as ProjectRoleType).name; }
            }
            return {
              id: member.id,
              username: userDetails ? (userDetails.displayName || userDetails.name) : `User ${member.userId}`,
              userId: member.userId, memberId: member.id, roleName,
              canRead: member.canRead, canWrite: member.canWrite, canExec: member.canExec,
              project: projectResult.data!.name,
            };
          } catch (e) { console.error(`Error enriching member ${member.id}:`, e); return null; }
        });
        const resolvedEnrichedMembers = (await Promise.all(enrichedPromises)).filter(m => m !== null) as EnrichedProjectMember[];
        setEnrichedMembersList(resolvedEnrichedMembers);
      } else {
        setEnrichedMembersList([]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while fetching project details.");
      setCurrentProjectDetail(null); setEnrichedMembersList([]);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [selectedProjectNameState]);

  // Effect 1: Determine targetUserId and fetch all projects for that user
  useEffect(() => {
    let isMounted = true;
    console.log("[Effect 1] Running: Determine target user and fetch project list.");
    const params = new URLSearchParams(location.search);
    const userIdFromUrlStr = params.get("userId");
    
    let newTargetUserId: number | null = null;

    if (userIdFromUrlStr) {
      const id = Number(userIdFromUrlStr);
      if (!isNaN(id)) {
        newTargetUserId = id;
        console.log(`[Effect 1] userId from URL: ${newTargetUserId}`);
      } else {
        if (isMounted) {
          setErrorMessage("Invalid userId in URL.");
          setIsLoadingProjectsList(false); setAllUserProjects([]); setCurrentProjectDetail(null);
        }
        return;
      }
    } else if (loggedInUser && loggedInUser.id) {
      newTargetUserId = loggedInUser.id;
      console.log(`[Effect 1] Using loggedInUser.id: ${newTargetUserId}`);
      if (!userIdFromUrlStr && isMounted) { // Only navigate if userId is not already in URL
        console.log(`[Effect 1] Navigating to set userId in URL: ${newTargetUserId}`);
        navigate(`/viewProject?userId=${newTargetUserId}`, { replace: true });
        return; // Important: return to let navigation take effect and re-trigger
      }
    }

    // Proceed only if newTargetUserId is determined and different, or if targetUserIdForProjects is null (initial load)
    if (newTargetUserId && (newTargetUserId !== targetUserIdForProjects || targetUserIdForProjects === null)) {
        if (isMounted) {
            setTargetUserIdForProjects(newTargetUserId); // Set the target user for other effects
            setIsLoadingProjectsList(true);
            setErrorMessage(null);
            setAllUserProjects([]); 
            setCurrentProjectDetail(null);
            setEnrichedMembersList([]);
            setSelectedProjectNameState("");

            console.log(`[Effect 1] Fetching projects for user ID: ${newTargetUserId}`);
            getUserProjects(newTargetUserId)
            .then(result => {
                if (!isMounted) return;
                if (result.status === 200 && result.data) {
                    console.log(`[Effect 1] Successfully fetched ${result.data.length} projects for user ${newTargetUserId}.`);
                    setAllUserProjects(result.data);
                } else {
                    setAllUserProjects([]);
                    throw new Error(result.error || `Failed to fetch projects for user ${newTargetUserId}`);
                }
            })
            .catch(err => {
                if (!isMounted) return;
                console.error("[Effect 1] Error fetching user projects:", err);
                setErrorMessage("Could not load projects: " + err.message);
                setAllUserProjects([]);
            })
            .finally(() => {
                if (isMounted) setIsLoadingProjectsList(false);
            });
        }
    } else if (!newTargetUserId && isMounted) {
        setErrorMessage("Please log in or provide a userId in the URL to view projects.");
        setIsLoadingProjectsList(false);
        setAllUserProjects([]);
        setCurrentProjectDetail(null);
    } else if (newTargetUserId === targetUserIdForProjects && isMounted) {
        // This means userId hasn't changed, but this effect might run due to location.search.
        // We might not need to re-fetch all projects if targetUserIdForProjects is already set correctly.
        // The primary purpose here is to establish targetUserIdForProjects and fetch the list if it changes.
        // If targetUserIdForProjects is already correct, ensure loading list is false.
         if (isLoadingProjectsList) setIsLoadingProjectsList(false);
    }

    return () => { isMounted = false; };
  }, [loggedInUser, location.search, navigate, targetUserIdForProjects]); // targetUserIdForProjects added

  // Effect 2: Load specific project details based on projectId in URL or default to first project
  useEffect(() => {
    let isMounted = true;
    console.log("[Effect 2] Running: Load specific project details.");
    const params = new URLSearchParams(location.search);
    const projectIdFromUrlStr = params.get("projectId");
    const userIdFromUrlForContext = params.get("userId"); // Get userId again for context in this effect

    // Only proceed if project list loading is complete AND we have a target user context
    if (isLoadingProjectsList || !targetUserIdForProjects) {
      console.log("[Effect 2] Skipping: Project list still loading or no target user ID.");
      return;
    }
    
    console.log(`[Effect 2] All projects for user ${targetUserIdForProjects} count: ${allUserProjects.length}`);

    let projectToLoadId: number | null = null;

    if (projectIdFromUrlStr) {
      const id = Number(projectIdFromUrlStr);
      if (!isNaN(id)) {
        projectToLoadId = id;
        console.log(`[Effect 2] projectId from URL: ${projectToLoadId}`);
      } else {
        if(isMounted) setErrorMessage("Invalid projectId in URL.");
        console.log("[Effect 2] Invalid projectId in URL.");
      }
    } else if (allUserProjects.length > 0) {
      // No projectId in URL, default to the first project from the user's list
      projectToLoadId = allUserProjects[0].id;
      console.log(`[Effect 2] No projectId in URL, defaulting to first project ID: ${projectToLoadId} for user ${targetUserIdForProjects}`);
      if(isMounted) {
        // Ensure userId is in the URL when defaulting projectId
        const currentUserIdInUrl = params.get("userId");
        const userIdParamForNav = currentUserIdInUrl || targetUserIdForProjects.toString();
        navigate(`/viewProject?userId=${userIdParamForNav}&projectId=${projectToLoadId}`, { replace: true });
        // Important: Return here as navigation will cause a re-render and this effect will run again
        // with the projectId in the URL, preventing potential double fetches or state issues.
        return; 
      }
    }

    if (projectToLoadId) {
      console.log(`[Effect 2] Attempting to load details for project ID: ${projectToLoadId}`);
      // Check if it's a new project or details haven't been loaded for the current one
      if (currentProjectDetail?.id !== projectToLoadId || (currentProjectDetail?.id === projectToLoadId && enrichedMembersList.length === 0 && !isLoadingDetails) ) {
        if(isMounted) fetchAndSetSingleProjectDetails(projectToLoadId, allUserProjects);
      } else if (currentProjectDetail?.id === projectToLoadId && isMounted) {
          // Project is already current, ensure dropdown name is synced
          if (selectedProjectNameState !== currentProjectDetail.name) {
              setSelectedProjectNameState(currentProjectDetail.name);
          }
          console.log(`[Effect 2] Project ${projectToLoadId} is already currentProjectDetail.`);
      }
    } else if (allUserProjects.length === 0 && !errorMessage && isMounted && !isLoadingProjectsList) {
      console.log(`[Effect 2] No projects for user ${targetUserIdForProjects}, setting error message.`);
      setErrorMessage(`No projects found for user ID ${targetUserIdForProjects}.`);
      setCurrentProjectDetail(null); 
      setEnrichedMembersList([]);
      setSelectedProjectNameState("");
    }
    
    return () => { isMounted = false; };
  }, [
    location.search, 
    allUserProjects, 
    isLoadingProjectsList, 
    targetUserIdForProjects, 
    fetchAndSetSingleProjectDetails, 
    navigate,
    currentProjectDetail, // Added to re-evaluate if current project matches URL
    enrichedMembersList.length, // Added to re-fetch if members are missing for current project
    selectedProjectNameState, // To help sync dropdown if project loaded by URL
    errorMessage // To prevent re-navigation if an error is already set
  ]);

  const handleDropdownSelect = (projectName: string) => {
    const projectToView = allUserProjects.find(p => p.name === projectName);
    const currentTargetUserId = targetUserIdForProjects || loggedInUser?.id; // Ensure we have a userId for the URL

    if (projectToView && currentTargetUserId) {
      const targetUrl = `/viewProject?userId=${currentTargetUserId}&projectId=${projectToView.id}`;
      // Only navigate if the target URL is different or if the current detail isn't this project
      if ((location.pathname + location.search !== targetUrl) || (currentProjectDetail?.id !== projectToView.id)) {
        navigate(targetUrl);
      }
    }
  };
  
  const projectOptions = useMemo(() => allUserProjects.map(p => p.name), [allUserProjects]);

  // Column definitions (same as before)
  const columns: GridColDef<EnrichedProjectMember>[] = [
    { field: "id", headerName: "Entry ID", flex: 0.5, hideable: true, width: 0, minWidth: 0, maxWidth: 0, },
    { field: "username", headerName: "User Name", flex: 1.2, renderCell: (params) => (<Typography variant="body2" fontWeight="600">{params.value}</Typography>), },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "memberId", headerName: "Member ID", flex: 1 },
    { field: "roleName", headerName: "Role", flex: 1, renderCell: (params: GridRenderCellParams<EnrichedProjectMember, string>) => (<Box sx={{ backgroundColor: colors.blueAccent[700], p: "5px 10px", borderRadius: "4px", display: "flex", alignItems: "center", }}><RoleIconDisplay canRead={params.row.canRead} canWrite={params.row.canWrite} canExec={params.row.canExec} /><Typography variant="body2">{params.value}</Typography></Box>),},
    { field: "canRead", headerName: "Read Access", flex: 0.8, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<EnrichedProjectMember, boolean|undefined>) => (<PermissionIndicator value={params.value} />), },
    { field: "canWrite", headerName: "Write Access", flex: 0.8, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<EnrichedProjectMember, boolean|undefined>) => (<PermissionIndicator value={params.value} />), },
    { field: "canExec", headerName: "Execute Access", flex: 0.8, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<EnrichedProjectMember, boolean|undefined>) => (<PermissionIndicator value={params.value} />), },
  ];

  // Memoized calculations for ProjectDetails (same as before)
  const projProgress = useMemo(() => {
    if (!currentProjectDetail?.issues?.length) return 0;
    const completed = currentProjectDetail.issues.filter(issue => issue.completed !== null).length;
    return (completed / currentProjectDetail.issues.length) * 100;
  }, [currentProjectDetail]);
  const completedIssueCount = useMemo(() => currentProjectDetail?.issues?.filter(issue => issue.completed !== null).length || 0, [currentProjectDetail]);
  const totalIssueCount = useMemo(() => currentProjectDetail?.issues?.length || 0, [currentProjectDetail]);
  const roleDistChartData = useMemo(() => {
    if (!enrichedMembersList?.length) return [];
    const distribution: Record<string, number> = {};
    enrichedMembersList.forEach(member => { const role = member.roleName || "Unknown"; distribution[role] = (distribution[role] || 0) + 1; });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [enrichedMembersList]);

  // Content display logic
  let contentDisplay;
  if (isLoadingProjectsList && !targetUserIdForProjects) { // Initial state before any user ID is determined
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3 }}><CircularProgress /><Typography sx={{ml: 2}}>Determining user context...</Typography></Box>);
  } else if (isLoadingProjectsList) { // Loading projects for a determined user
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3 }}><CircularProgress /><Typography sx={{ml: 2}}>Loading projects for user {targetUserIdForProjects}...</Typography></Box>);
  } else if (errorMessage && allUserProjects.length === 0 && !currentProjectDetail) {
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3, textAlign: 'center' }}><Typography variant="h5" color="error">{errorMessage}</Typography></Box>);
  } else if (!isLoadingProjectsList && allUserProjects.length === 0 && !errorMessage) {
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3 }}><Typography variant="h5" color={colors.grey[300]}>No projects found for user {targetUserIdForProjects}.</Typography></Box>);
  } else { // Projects list is available (or was attempted), or a specific project is being loaded/is loaded
    contentDisplay = (
      <>
        <Paper elevation={3} sx={{ mb: 4, width: "100%", display: "flex", flexDirection: "column", backgroundColor: theme.palette.mode === "light" ? colors.primary[900] : colors.primary[400], color: colors.grey[100], borderRadius: "8px", overflow: "hidden", }}>
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ mr: 2, color: colors.grey[100] }}>Project:</Typography>
              {allUserProjects.length > 0 ?
                <DropDown value={selectedProjectNameState} onSelect={handleDropdownSelect} options={projectOptions} label="Select Project"/>
                : <Typography sx={{ml:1, color: colors.grey[400]}}>No projects available.</Typography>
              }
            </Box>
            <Typography variant="h5" sx={{ color: colors.grey[100], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "1.2rem", mt: {xs: 1, md: 0} }}>
              {currentProjectDetail ? `Members of ${currentProjectDetail.name}` : (allUserProjects.length > 0 ? "Select a Project" : "Project Members")}
            </Typography>
          </Box>
          <Box sx={{ px: 2, pb: 2, display: "flex", flexWrap: "wrap", gap: 2, }}>
            <Box sx={{ display: "flex", alignItems: "center" }}><AdminPanelSettingsIcon sx={{ color: "#ff9800", mr: 1 }} /><Typography variant="body2" color={colors.grey[100]}>Full Access</Typography></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}><EditIcon sx={{ color: "#2196f3", mr: 1 }} /><Typography variant="body2" color={colors.grey[100]}>Editor</Typography></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}><VisibilityIcon sx={{ color: "#9c27b0", mr: 1 }} /><Typography variant="body2" color={colors.grey[100]}>Viewer</Typography></Box>
          </Box>
          <Box sx={{ height: "65vh", width: "100%" }}>
            {isLoadingDetails && <Box sx={{display: 'flex', justifyContent:'center', alignItems:'center', height:'100%'}}><CircularProgress /><Typography sx={{ml:1}}>Loading members...</Typography></Box>}
            {!isLoadingDetails && !currentProjectDetail && allUserProjects.length > 0 && <Typography sx={{textAlign: 'center', mt: 4}}>Please select a project from the dropdown to view its members.</Typography>}
            {!isLoadingDetails && currentProjectDetail && enrichedMembersList.length === 0 && <Typography sx={{textAlign: 'center', mt: 4}}>No members found for this project.</Typography>}
            {!isLoadingDetails && currentProjectDetail && enrichedMembersList.length > 0 && (
                <DataGrid rows={enrichedMembersList} columns={columns} slots={{ toolbar: GridToolbar }} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } }, columns: { columnVisibilityModel: { id: false, memberId: false }, }, }} pageSizeOptions={[5, 10, 25, 50]} sx={{ border: "none", color: colors.grey[100], "& .MuiDataGrid-columnHeaders": { backgroundColor: theme.palette.mode === "light" ? colors.primary[300] : colors.primary[500], }, "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400], }, "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700], }, "& .MuiDataGrid-toolbarContainer": { "& .MuiButton-root": { color: colors.grey[100] } } }}/>
            )}
            {/* Display detail-specific error message if it exists and no details are shown */}
            {!isLoadingDetails && errorMessage && !currentProjectDetail && allUserProjects.length > 0 && <Typography sx={{textAlign: 'center', mt: 4, color: 'error.main'}}>{errorMessage}</Typography>}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ mb: 4, p: 3, backgroundColor: theme.palette.mode === "light" ? colors.primary[900] : colors.primary[400], color: colors.grey[100], borderRadius: "8px", display: "flex", flexDirection: "column", }}>
          {isLoadingDetails && currentProjectDetail && <Box sx={{display: 'flex', justifyContent:'center', alignItems:'center', p:3}}><CircularProgress size={20}/><Typography sx={{ml:1}}>Loading details...</Typography></Box>}
          {!isLoadingDetails && currentProjectDetail ? (
            <ProjectDetails project={currentProjectDetail} enrichedMembersCount={enrichedMembersList.length} projectProgressCalculated={projProgress} completedIssuesCount={completedIssueCount} totalIssuesCount={totalIssueCount} roleDistributionChartData={roleDistChartData}/>
          ) : (
            !isLoadingDetails && <Box sx={{ p: 3, textAlign: "center" }}><Typography variant="h6" color={colors.grey[300]}> {(allUserProjects.length > 0 || isLoadingProjectsList) ? "Select a project to see its details." : (errorMessage || "No project data to display.")} </Typography></Box>
          )}
        </Paper>
      </>
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 64px)", overflowY: "auto", p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.mode === "light" ? colors.primary[400] : colors.primary[500], color: colors.grey[100], }}>
      <Box sx={{ minHeight: "100%", backgroundColor: theme.palette.mode === "light" ? "colors.primary[900]" : colors.primary[400], boxSizing: "border-box", }}>
        <Header title="Project Dashboard" subtitle="View project details and manage members" />
        {contentDisplay}
      </Box>
    </Box>
  );
};

export default ViewProject;
