// src/Components/ViewProject.tsx
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Grid,
  Chip,
  CircularProgress,
  Link as MuiLink, // For clickable project names
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'; // RouterLink for navigation
import { tokens } from "../theme";
import Header from "./Header";

// Recharts imports are kept as requested, though charts are not displayed in this version
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

// Icons for ProjectSummaryCard
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArchiveIcon from '@mui/icons-material/Archive';
import AssignmentIcon from '@mui/icons-material/Assignment'; // For issue count
import EventIcon from '@mui/icons-material/Event'; // For created date
import { alpha } from "@mui/material/styles";

import { getUserProjects } from "../utils/getters.utils";
import {
  Project,
  User, // Still needed for loggedInUser context
  Tag,
  // Issue, // Not directly used if not showing full details
} from "../utils/types";
import { useUser as useAuthUser } from '../hooks/UserContext';

// Simplified Project Summary Card Component
const ProjectSummaryCard = ({ project, targetUserId }: { project: Project; targetUserId: number | null }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Attempt to get a more meaningful issue count if 'issues' contains actual Issue objects
  const totalIssues = project.issues?.length || 0;
  const completedIssues = project.issues?.filter(issue => issue.completed).length || 0;
  
  // Format created date if available (assuming Project type might have it, or first issue's date)
  // For this version, we'll assume 'created' on Project object if available from getUserProjects,
  // otherwise, this part can be omitted or adapted if 'created' is on issues array.
  // Your Project type in types.ts does not have a 'created' field directly.
  // Let's use a placeholder or omit if not directly available on Project from getUserProjects.
  // For now, I'll assume project.charter can be used as a placeholder for a date if needed, or we omit date.
  // A better approach would be for getUserProjects to return a 'createdAt' field for each project summary.
  // Let's display Org ID and Budget as primary info.

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5, // Increased padding for better spacing
        mb: 2.5, // Increased margin bottom
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        borderLeft: `5px solid ${project.archived ? colors.redAccent[600] : colors.greenAccent[500]}`,
        borderRadius: '8px', // Slightly more rounded
        '&:hover': {
          boxShadow: `0px 4px 20px ${project.archived ? colors.redAccent[700] : colors.greenAccent[700]}`,
          transform: 'translateY(-3px) scale(1.01)',
        },
        transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <MuiLink
          component={RouterLink}
          // This link now points to a URL that WOULD show details if that page existed/was different
          // For now, it just makes the name clickable.
          // To make it functional, you'd need a separate route/component for single project details
          // or re-introduce the logic to show details on this page when a projectId is also in URL.
          to={`/viewProject?userId=${targetUserId}&projectId=${project.id}`}
          sx={{ textDecoration: 'none' }}
        >
          <Typography variant="h5" sx={{ color: colors.greenAccent[400], fontWeight: 'bold', '&:hover': { color: colors.greenAccent[300] } }}>
            {project.name}
          </Typography>
        </MuiLink>
        <Chip
            icon={project.archived ? <ArchiveIcon fontSize="small"/> : <CheckCircleOutlineIcon fontSize="small"/>}
            label={project.archived ? 'Archived' : 'Active'}
            size="small"
            sx={{
                backgroundColor: project.archived ? colors.grey[700] : colors.greenAccent[700],
                color: project.archived ? colors.grey[100] : colors.grey[900],
                fontWeight: 'medium'
            }}
        />
      </Box>

      <Typography 
        variant="body2" 
        sx={{ 
            fontStyle: 'italic', 
            color: colors.grey[300], 
            mb: 2,
            height: '4.5em', // Approx 3 lines
            lineHeight: '1.5em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
        }}
      >
        {project.charter || "No charter available."}
      </Typography>

      <Grid container spacing={2} sx={{color: colors.grey[200], alignItems: 'center'}}>
        <Grid item xs={12} sm={4} md={3}>
          <Box display="flex" alignItems="center" title="Organization ID">
            <AccountTreeIcon fontSize="small" sx={{ mr: 0.8, color: colors.blueAccent[300] }} />
            <Typography variant="body2">Org: {project.orgId}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Box display="flex" alignItems="center" title="Budget">
            <AttachMoneyIcon fontSize="small" sx={{ mr: 0.8, color: colors.blueAccent[300] }} />
            <Typography variant="body2">${project.budget.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
           <Box display="flex" alignItems="center" title="Issues">
            <AssignmentIcon fontSize="small" sx={{mr:0.8, color: colors.blueAccent[300]}} />
            <Typography variant="body2">{completedIssues} / {totalIssues} Issues</Typography>
          </Box>
        </Grid>
        {/* Placeholder for a created date if available on Project summary from backend */}
        {/* <Grid item xs={12} sm={4} md={3}>
           <Box display="flex" alignItems="center" title="Created Date">
            <EventIcon fontSize="small" sx={{mr:0.8, color: colors.blueAccent[300]}} />
            <Typography variant="body2">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}</Typography>
          </Box>
        </Grid> */}
      </Grid>

      {project.tags && project.tags.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {project.tags.slice(0, 5).map((tag: Tag) => ( // Show up to 5 tags
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: tag.color || colors.grey[700], 
                color: tag.color || colors.grey[300],
                backgroundColor: alpha(tag.color || colors.grey[700], 0.1)
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};


const ViewProject = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: loggedInUser } = useAuthUser();

  const [allUserProjects, setAllUserProjects] = useState<Project[]>([]);
  const [isLoadingProjectsList, setIsLoadingProjectsList] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetUserIdForProjects, setTargetUserIdForProjects] = useState<number | null>(null);

  // Effect 1: Determine targetUserId and fetch the list of projects for that user.
  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(location.search);
    const userIdFromUrlStr = params.get("userId");
    let newTargetUserId: number | null = null;

    if (userIdFromUrlStr) {
      const id = Number(userIdFromUrlStr);
      if (!isNaN(id)) newTargetUserId = id;
      else {
        if (isMounted) { setErrorMessage("Invalid userId in URL."); setIsLoadingProjectsList(false); setAllUserProjects([]);}
        return;
      }
    } else if (loggedInUser && loggedInUser.id) {
      newTargetUserId = loggedInUser.id;
      if (!userIdFromUrlStr && isMounted) {
        navigate(`/viewProject?userId=${newTargetUserId}`, { replace: true });
        return; 
      }
    }

    if (newTargetUserId && (newTargetUserId !== targetUserIdForProjects || allUserProjects.length === 0)) {
      if (isMounted) {
        setTargetUserIdForProjects(newTargetUserId);
        setIsLoadingProjectsList(true);
        setErrorMessage(null); 
        setAllUserProjects([]); 

        getUserProjects(newTargetUserId)
          .then(result => {
            if (!isMounted) return;
            if (result.status === 200 && result.data) {
              setAllUserProjects(result.data);
              if (result.data.length === 0) {
                setErrorMessage(`No projects found for user ID ${newTargetUserId}.`);
              }
            } else {
              setAllUserProjects([]);
              throw new Error(result.error || `Failed to fetch projects for user ${newTargetUserId}`);
            }
          })
          .catch(err => {
            if (!isMounted) return;
            setErrorMessage("Could not load projects: " + err.message);
            setAllUserProjects([]);
          })
          .finally(() => {
            if (isMounted) setIsLoadingProjectsList(false);
          });
      }
    } else if (!newTargetUserId && isMounted) {
      setErrorMessage("Please log in or provide a userId in the URL to view projects.");
      setIsLoadingProjectsList(false); setAllUserProjects([]);
    } else if (newTargetUserId === targetUserIdForProjects && isMounted && isLoadingProjectsList) {
      setIsLoadingProjectsList(false);
    }
    return () => { isMounted = false; };
  }, [loggedInUser, location.search, navigate, targetUserIdForProjects, allUserProjects.length]);


  // Content display logic
  let contentDisplay;
  if (isLoadingProjectsList && !targetUserIdForProjects) {
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3 }}><CircularProgress /><Typography sx={{ml: 2}}>Determining user context...</Typography></Box>);
  } else if (isLoadingProjectsList) {
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3 }}><CircularProgress /><Typography sx={{ml: 2}}>Loading projects for user {targetUserIdForProjects}...</Typography></Box>);
  } else if (errorMessage) { 
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3, textAlign: 'center' }}><Typography variant="h5" color="error">{errorMessage}</Typography></Box>);
  } else if (!isLoadingProjectsList && allUserProjects.length === 0) { 
    contentDisplay = (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)', p:3 }}><Typography variant="h5" color={colors.grey[300]}>No projects found for user {targetUserIdForProjects}.</Typography></Box>);
  } else { // Projects list is available
    contentDisplay = (
      <Box>
        {allUserProjects.map(project => (
          <ProjectSummaryCard key={project.id} project={project} targetUserId={targetUserIdForProjects} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 64px)", overflowY: "auto", p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.mode === "light" ? colors.primary[400] : colors.primary[500], color: colors.grey[100], }}>
      <Box sx={{ minHeight: "100%", backgroundColor: theme.palette.mode === "light" ? "colors.primary[900]" : colors.primary[400], boxSizing: "border-box", }}>
        <Header 
            title={targetUserIdForProjects ? `Projects for User ${targetUserIdForProjects}` : "Projects Dashboard"} 
            subtitle={allUserProjects.length > 0 ? `Displaying ${allUserProjects.length} project(s)` : "Listing projects associated with the user."}
        />
        {contentDisplay}
      </Box>
    </Box>
  );
};

export default ViewProject;
