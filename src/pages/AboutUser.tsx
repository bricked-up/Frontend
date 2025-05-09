import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Divider,
  CircularProgress, // Added for loading states of details
  Alert,            // Added for error display of details
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import LoadingPage from "./LoadingPage";
import Form from "../Components/AccountPage/Form";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { getUser, getOrg, getProject } from "../utils/getters.utils"; // Ensure getOrg and getProject are correctly imported
import {
  User,
  OrgMember,
  ProjectMember,
  Organization as OrgDetailsType, // Renamed to avoid conflict if OrgMember is different
  Project as ProjectDetailsType,   // Renamed to avoid conflict
  Issue, // Assuming you might want to fetch Issue details later
} from "../utils/types";

// Helper function to check if an item is an OrgMember (and not a number)
function isOrgMember(item: any): item is OrgMember {
  return typeof item === 'object' && item !== null && 'orgId' in item && 'id' in item;
}

// Helper function to check if an item is a ProjectMember (and not a number)
function isProjectMember(item: any): item is ProjectMember {
  return typeof item === 'object' && item !== null && 'projectId' in item && 'id' in item;
}


const AboutUser: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, setUser } = useUser();
  const { userId } = useParams<{ userId: string }>(); // Ensure userId is typed
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const confirmationShown = useRef(false);

  // State for fetched organization and project details
  const [organizationDetails, setOrganizationDetails] = useState<OrgDetailsType[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsType[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);


  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isLoaded && !confirmationShown.current) {
        confirmationShown.current = true;
        const confirmed = window.confirm(
          "Unable to load user profile. Click OK to return to home page."
        );
        if (confirmed) {
          navigate("/");
        }
        // setIsLoaded(true); // Don't set isLoaded true here, let fetchAndSetUser handle it
      }
    }, 5000); // 5 seconds timeout

    if (!userId) {
      console.log("No userId found in params.");
      setIsLoaded(true); // Nothing to load
      clearTimeout(timeoutId);
      return;
    }

    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
        console.error("Invalid userId format:", userId);
        // Optionally navigate or show an error
        setIsLoaded(true);
        clearTimeout(timeoutId);
        return;
    }


    const fetchAndSetUser = async () => {
      setIsLoaded(false); // Reset loading state for new fetch
      confirmationShown.current = false; // Reset confirmation for new fetch attempt

      try {
        console.log(`Workspaceing user with ID: ${numericUserId}`);
        const fetchedUser = await getParsedUserById(numericUserId);

        if (!fetchedUser) {
          console.log("User not found by getParsedUserById");
          if (!confirmationShown.current) {
            confirmationShown.current = true;
            const confirmed = window.confirm(
              "User does not exist. Click OK to return to home page."
            );
            if (confirmed) {
              navigate("/");
            }
          }
          setViewedUser(null);
          setIsLoaded(true);
          return;
        }

        console.log("User data fetched:", fetchedUser);
        setViewedUser(fetchedUser);
        setIsOwnProfile(!!user && fetchedUser.id === user.id); // Ensure user is not null

        // Now fetch organization and project details
        setIsLoadingDetails(true);
        setDetailsError(null);

        // Fetch Organization Details
        if (fetchedUser.organizations && fetchedUser.organizations.length > 0) {
          if (typeof fetchedUser.organizations[0] === 'number') {
            console.log("Fetching organization details for IDs:", fetchedUser.organizations);
            const orgPromises = (fetchedUser.organizations as number[]).map(id => getOrg(id));
            const orgResults = await Promise.all(orgPromises);
            const successfulOrgs = orgResults
              .filter(res => res.status === 200 && res.data && Object.keys(res.data).length > 0)
              .map(res => res.data as OrgDetailsType);
            setOrganizationDetails(successfulOrgs);
            console.log("Fetched organization details:", successfulOrgs);
          } else if (isOrgMember(fetchedUser.organizations[0])) {
             // This case implies that getUser already returned full OrgMember details.
             // However, we typically display Organization names, etc., so we might still prefer to fetch full OrgDetailsType if OrgMember is just a linking table entry.
             // For now, if they are OrgMember objects, we need a way to display them or map them to OrgDetailsType.
             // This part might need adjustment based on what `OrgMember` contains vs `OrgDetailsType`.
             // The current map in the JSX expects OrgMember structure if this path is taken.
             // To simplify, let's assume if it's not numbers, it's OrgMember[] and the JSX is fine with it.
             // OR, fetch full org details for each org.id from OrgMember if OrgMember has orgId
            console.warn("Organizations are already objects, type check needed for mapping or further fetching.");
            // If `WorkspaceedUser.organizations` are `OrgMember[]` and you need `OrgDetailsType[]`
            // you might need to iterate and call `getOrg(org.orgId)` for each.
            // For simplicity, if your JSX for orgs can work with `OrgMember[]`, you can cast it:
            // setOrganizationDetails(fetchedUser.organizations as OrgDetailsType[]); // This might be incorrect if types differ
            // For now, let's assume if it's not numbers, the current JSX is expecting OrgMember[] which is already there.
            // So, no separate state update for 'organizationDetails' if 'viewedUser.organizations' are already full objects.
          }
        } else {
          setOrganizationDetails([]);
        }

        // Fetch Project Details
        if (fetchedUser.projects && fetchedUser.projects.length > 0) {
          if (typeof fetchedUser.projects[0] === 'number') {
            console.log("Fetching project details for IDs:", fetchedUser.projects);
            const projPromises = (fetchedUser.projects as number[]).map(id => getProject(id));
            const projResults = await Promise.all(projPromises);
            const successfulProjects = projResults
              .filter(res => res.status === 200 && res.data && Object.keys(res.data).length > 0)
              .map(res => res.data as ProjectDetailsType);
            setProjectDetails(successfulProjects);
            console.log("Fetched project details:", successfulProjects);
          } else if (isProjectMember(fetchedUser.projects[0])) {
            console.warn("Projects are already objects, type check needed for mapping or further fetching.");
             // Similar to organizations, if 'viewedUser.projects' are already ProjectMember[],
             // the JSX mapping needs to handle ProjectMember[] directly.
          }
        } else {
          setProjectDetails([]);
        }

        setIsLoadingDetails(false);
        setIsLoaded(true);
        clearTimeout(timeoutId); // Clear timeout once successfully loaded

      } catch (error) {
        console.error("Error loading user data or details:", error);
        setDetailsError("Failed to load associated details.");
        if (!confirmationShown.current) {
          confirmationShown.current = true;
          // const confirmed = window.confirm( // Avoid window.confirm in catch block of async
          // "Error loading user data. Click OK to return to home page."
          // );
          // if (confirmed) {
          // navigate("/");
          // }
          // Better to show an error message on the page
        }
        setIsLoadingDetails(false);
        setIsLoaded(true); // Still loaded, but with an error
        clearTimeout(timeoutId);
      }
    };

    fetchAndSetUser();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userId, user, navigate]); // Removed isLoaded from dependencies to avoid re-triggering fetch unnecessarily

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile || !viewedUser) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      // Update local state for immediate visual feedback
      setViewedUser({ ...viewedUser, avatar: imageUrl });
      if (user && user.id === viewedUser.id) {
        setUser({ ...user, avatar: imageUrl }); // Update context as well
      }
      // TODO: Here you would also call an API to upload the image file to the backend
      // and update the user's avatar URL in the database.
      // e.g., sendUserData({...viewedUser, avatarFile: file}, "update-user-avatar");
      console.log("New avatar selected (locally):", imageUrl);
      alert("Avatar updated locally. Backend integration for upload needed.");
    }
  };

  if (!isLoaded && !viewedUser) return <LoadingPage />; // Show loading page until initial fetch attempt is done
  if (!viewedUser && isLoaded) { // Fetch attempt done, but no user
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Paper elevation={3} sx={{p:3}}>
                <Typography variant="h6">User profile could not be loaded or does not exist.</Typography>
                <Button onClick={() => navigate('/')} sx={{mt: 2}}>Go to Home</Button>
            </Paper>
        </Box>
    );
  }
  if (!viewedUser) return null; // Should be covered by above, but as a fallback


  // --- Render Logic ---
  // Helper to render organization list
  const renderOrganizations = () => {
    if (isLoadingDetails && organizationDetails.length === 0 && (!viewedUser.organizations || typeof viewedUser.organizations[0] === 'number')) {
      return <CircularProgress size={24} />;
    }
    if (viewedUser.organizations && viewedUser.organizations.length > 0) {
      // Case 1: organizations are full OrgMember objects from the start
      if (isOrgMember(viewedUser.organizations[0])) {
        return (viewedUser.organizations as OrgMember[]).map((org, index) => (
          <Box key={`org-member-${org.id}-${index}`} sx={{ mb: 1 }}>
            <Typography>
              Organization ID (from member record): {org.orgId} — Membership ID: {org.id}
            </Typography>
            {org.roles && org.roles.length > 0 && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                Roles: {org.roles.map((role) => role.name).join(", ")}
              </Typography>
            )}
          </Box>
        ));
      }
      // Case 2: We fetched full Organization details based on IDs
      if (organizationDetails.length > 0) {
        return organizationDetails.map((orgDetail, index) => (
          <Box key={`org-detail-${orgDetail.id}-${index}`} sx={{ mb: 1, p:1, border: '1px solid #eee', borderRadius: 1}}>
            <Typography variant="subtitle1"><strong>{orgDetail.name}</strong> (ID: {orgDetail.id})</Typography>
            {/* Here you might want to show roles if you fetch OrgMember entries associated with this viewedUser and orgDetail.id */}
            {/* For now, just listing the organization name and ID */}
          </Box>
        ));
      }
    }
    return <Typography>No organization memberships found or details not loaded.</Typography>;
  };

  // Helper to render project list
  const renderProjects = () => {
    if (isLoadingDetails && projectDetails.length === 0 && (!viewedUser.projects || typeof viewedUser.projects[0] === 'number')) {
      return <CircularProgress size={24} />;
    }
    if (viewedUser.projects && viewedUser.projects.length > 0) {
      // Case 1: projects are full ProjectMember objects
      if (isProjectMember(viewedUser.projects[0])) {
        return (viewedUser.projects as ProjectMember[]).map((proj, index) => (
          <Box key={`proj-member-${proj.id}-${index}`} sx={{ mb: 1 }}>
            <Typography>
              Project ID (from member record): {proj.projectId} — Membership ID: {proj.id}
            </Typography>
            {proj.roles && proj.roles.length > 0 && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                Roles: {proj.roles.map((role) => role.name).join(", ")}
              </Typography>
            )}
          </Box>
        ));
      }
      // Case 2: We fetched full Project details based on IDs
      if (projectDetails.length > 0) {
        return projectDetails.map((projDetail, index) => (
           <Box key={`proj-detail-${projDetail.id}-${index}`} sx={{ mb: 1, p:1, border: '1px solid #eee', borderRadius: 1}}>
            <Typography variant="subtitle1"><strong>{projDetail.name}</strong> (ID: {projDetail.id})</Typography>
            <Typography variant="body2">Budget: ${projDetail.budget}</Typography>
            <Typography variant="caption">Charter: {projDetail.charter || "N/A"}</Typography>
          </Box>
        ));
      }
    }
    return <Typography>No project memberships found or details not loaded.</Typography>;
  };


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        pt: 2, // Add some padding at the top
      }}
    >
      {/* Removed sticky Box for navbar, assuming navbar is handled by Layout component */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        width="100%"
        mt={user ? 2 : 8} // Adjust margin if user is logged in (potential navbar height)
        px={2}
      >
        <Paper
          elevation={8}
          sx={{
            width: { xs: "95%", md: "700px" }, // Slightly wider
            p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
            borderRadius: "12px", // Smoother radius
            backdropFilter: "blur(12px)",
            background: isDark
              ? "rgba(30, 41, 59, 0.8)" // Darker blur for better contrast
              : "rgba(255, 255, 255, 0.9)", // Lighter blur
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.4)" // More pronounced shadow
              : "0 8px 20px rgba(0,194,255,0.2)",
            overflowY: "auto",
            maxHeight: "calc(100vh - 100px)", // Ensure it doesn't go off-screen
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} // Slightly faster animation
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <img
                src={viewedUser.avatar || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(viewedUser.displayName || viewedUser.name || "default")}`}
                alt="Profile"
                style={{
                  width: 120, // Larger avatar
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `4px solid ${theme.palette.primary.main}`, // Use theme primary color
                  marginBottom: "1rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              />
              {isOwnProfile && (
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImagePlus size={18} />} // Adjusted icon size
                    sx={{
                      mt: 1,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600, // Slightly bolder
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      py: 0.8, // Padding adjustment
                      px: 2,
                      "&:hover": {
                        background: theme.palette.action.hover,
                        borderColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Change Avatar
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>
              )}
              <Typography variant="h4" fontWeight={700} sx={{ mt: 2, color: theme.palette.text.primary }}> {/* Adjusted h variant */}
                {viewedUser.displayName || viewedUser.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">{viewedUser.email}</Typography> {/* Adjusted variant */}
            </Box>

            <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

            <Box sx={{mb: 2}}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Verification
              </Typography>
              <Typography variant="body1"> {/* Adjusted variant */}
                {viewedUser.verified ? "Email Verified ✅" : "Not Verified ❌"}
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

            <Box sx={{mb: 2}}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Organizations
              </Typography>
              {detailsError && !isLoadingDetails && <Alert severity="warning" sx={{mb:1}}>{detailsError}</Alert>}
              {renderOrganizations()}
            </Box>

            <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

            <Box sx={{mb: 2}}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Projects
              </Typography>
              {detailsError && !isLoadingDetails && <Alert severity="warning" sx={{mb:1}}>{detailsError}</Alert>}
              {renderProjects()}
            </Box>

            {isOwnProfile && (
              <Box mt={4}> {/* Increased margin */}
                <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom> {/* Adjusted variant */}
                  Edit Your Profile
                </Typography>
                <Form />
              </Box>
            )}
          </motion.div>
        </Paper>
      </Box>
    </Box>
  );
};

export default AboutUser;

/**
 * Fetches and parses user data by user ID.
 * Wraps the getUser API call and maps response to expected structure.
 *
 * @param userId - ID of the user to fetch.
 * @returns Parsed user object or null if not found or error.
 */
export const getParsedUserById = async (userId: number): Promise<User | null> => {
  console.log(`getParsedUserById called for ID: ${userId}`);
  if (isNaN(userId)) {
    console.error("getParsedUserById received NaN for userId");
    return null;
  }
  try {
    const result = await getUser(userId);
    console.log(`getUser result for ID ${userId}:`, result);


    if (!result || result.status !== 200 || !result.data || Object.keys(result.data).length === 0) {
        if (result && result.status === 204) { // Specifically handle 204 No Content as user not found
             console.warn(`User with ID ${userId} not found (204 No Content).`);
        } else if (result && result.data && Object.keys(result.data).length === 0 && result.status === 200){
            // This is the case where getUser returns 200 with data: {} for not found (as per getter logic)
            console.warn(`User with ID ${userId} not found (200 with empty data object).`);
        } else {
            console.error(`Failed to fetch user or user data is null/empty for ID ${userId}. Status: ${result?.status}`);
        }
      return null;
    }

    const userData = result.data as User; // Assume data matches User type if status is 200 and data is present

    // Ensure default values for potentially missing fields to match User type strictly
    // The `getUser` should ideally return data that already conforms to `User` or needs minimal parsing here.
    return {
      id: userData.id,
      displayName: userData.displayName || userData.name || '', // Fallback for displayName
      email: userData.email || '',
      name: userData.name || '',
      password: userData.password, // Password should ideally not be part of this response
      verified: userData.verified ?? false,
      avatar: userData.avatar || null, // Ensure it can be null as per User type
      // These will be arrays of numbers if `getUser` returns IDs, or arrays of objects if it returns full details.
      // The component logic above will handle fetching details if they are IDs.
      organizations: userData.organizations || [],
      projects: userData.projects || [],
      issues: userData.issues || [], // Added issues
      sessions: userData.sessions || [], // Added sessions
      verifyId: userData.verifyId === undefined ? null : userData.verifyId // ensure it can be null
    };
  } catch (error) {
    console.error(`Error in getParsedUserById for ID ${userId}:`, error);
    return null;
  }
};