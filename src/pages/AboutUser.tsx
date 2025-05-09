// src/pages/AboutUser.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import LoadingPage from "./LoadingPage";
import Form from "../Components/AccountPage/Form"; // <<<< RE-ADDED THIS IMPORT
import { motion } from "framer-motion";
import { ImagePlus, Trash2 } from "lucide-react"; // Added Trash2 for delete icon
import { getUser } from "../utils/getters.utils";
import { User, OrgMember, ProjectMember } from "../utils/types";

// Import delete utilities
import DeleteButton from '../Components/AccountPage/DeleteButton'; // Assuming this is the styled button
import { deleteUser as apiDeleteUser, logout as apiLogout } from '../utils/account.utils';

// Helper function (assuming it's defined as in the previous version or imported)
export const getParsedUserById = async (userIdToFetch: number): Promise<User | null> => {
  try {
    const result = await getUser(userIdToFetch);
    if (result.status !== 200 || !result.data) {
      console.warn(`User with ID ${userIdToFetch} not found or error fetching: Status ${result.status}`);
      return null;
    }
    const userDataFromApi = result.data;
    const parsedUser: User = {
      id: userDataFromApi.id,
      displayName: userDataFromApi.displayName || 'N/A',
      email: userDataFromApi.email || 'N/A',
      name: userDataFromApi.name || 'N/A',
      password: userDataFromApi.password || '',
      verified: userDataFromApi.verified ?? false,
      avatar: userDataFromApi.avatar || null,
      organizations: userDataFromApi.organizations || [],
      projects: userDataFromApi.projects || [],
    };
    return parsedUser;
  } catch (error) {
    console.error(`Error in getParsedUserById for ID ${userIdToFetch}:`, error);
    return null;
  }
};

const AboutUser: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: loggedInUser, setUser: setLoggedInUser } = useUser();
  const { userId: userIdFromParams } = useParams<{ userId: string }>();

  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // For delete operation loading state
  const confirmationShown = useRef(false);

  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchAndSetUser = async () => {
      setIsLoading(true);
      confirmationShown.current = false;

      if (!userIdFromParams) {
        console.error("User ID not found in URL parameters.");
        navigate("/");
        setIsLoading(false);
        return;
      }
      timeoutId = setTimeout(() => {
        if (!confirmationShown.current) {
          confirmationShown.current = true;
          const confirmed = window.confirm(
            "Loading user profile is taking longer than expected. Click OK to return to the home page, or Cancel to keep waiting."
          );
          if (confirmed) navigate("/");
        }
      }, 7000);

      try {
        const numericUserId = parseInt(userIdFromParams, 10);
        if (isNaN(numericUserId)) {
          console.error("Invalid User ID in URL:", userIdFromParams);
          if (!confirmationShown.current) {
            confirmationShown.current = true;
            window.alert("Invalid user profile ID.");
          }
          navigate("/");
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }
        const fetchedUser = await getParsedUserById(numericUserId);
        clearTimeout(timeoutId);

        if (!fetchedUser) {
          if (!confirmationShown.current) {
            confirmationShown.current = true;
            const confirmed = window.confirm("User does not exist. Click OK to return to home page.");
            if (confirmed) navigate("/");
          }
          setViewedUser(null);
        } else {
          setViewedUser(fetchedUser);
          if (loggedInUser && fetchedUser.id === loggedInUser.id) {
            setIsOwnProfile(true);
          } else {
            setIsOwnProfile(false);
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("Error loading user data:", error);
        if (!confirmationShown.current) {
          confirmationShown.current = true;
          const confirmed = window.confirm("Error loading user data. Click OK to return to home page.");
          if (confirmed) navigate("/");
        }
        setViewedUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetUser();
    return () => clearTimeout(timeoutId);
  }, [userIdFromParams, loggedInUser, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile || !loggedInUser) return;
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      const updatedUser: User = { ...loggedInUser, avatar: imageUrl };
      setLoggedInUser(updatedUser);
    }
  };

  const handleDeleteAccountRequest = () => {
    setShowDeleteConfirmDialog(true);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!isOwnProfile || !loggedInUser) {
      alert("Cannot delete account. Operation not permitted.");
      setShowDeleteConfirmDialog(false);
      return;
    }
    setIsDeleting(true);
    try {
      // **IMPORTANT**: Replace 'users' with your actual base API endpoint for user deletion.
      const status = await apiDeleteUser(loggedInUser.id, 'users'); // Endpoint needs verification

      if (status === 200 || status === 204) {
        alert("Account deleted successfully.");
        apiLogout(); // From account.utils.ts
        setLoggedInUser(null); // Clear user from context
        navigate('/login'); // Redirect to login page
      } else {
        alert(`Failed to delete account. Server responded with status: ${status}.`);
      }
    } catch (error: any) {
      console.error("Account deletion process error:", error);
      alert(error.message || "An unexpected error occurred during deletion.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmDialog(false);
    }
  };

  if (isLoading) return <LoadingPage />;
  if (!viewedUser) {
    return (
      <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6">User profile could not be loaded.</Typography>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </Box>
    );
  }

  const avatarSrc = (isOwnProfile && loggedInUser?.avatar) ? loggedInUser.avatar : viewedUser.avatar;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}
    >
      <Box sx={{ width: "100%", position: "sticky", top: 0, zIndex: 1100, backgroundColor: theme.palette.background.paper, boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 6px rgba(0,0,0,0.1)" }}>
        {/* Optional Header Content */}
      </Box>

      <Box display="flex" justifyContent="center" alignItems="flex-start" width="100%" mt={4} px={2}>
        <Paper
          elevation={8}
          sx={{
            width: { xs: "95%", md: "600px" }, p: 4, borderRadius: 4, backdropFilter: "blur(12px)",
            background: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.85)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 6px 16px rgba(0,194,255,0.15)",
            overflowY: "auto", maxHeight: "calc(100vh - 100px)",
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <img
                src={avatarSrc || "https://via.placeholder.com/150"}
                alt={`${viewedUser.displayName}'s Profile`}
                style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `3px solid ${isDark ? "#38bdf8" : "#6366f1"}`, marginBottom: "1rem" }}
              />
              {isOwnProfile && (
                <Box>
                  <Button component="label" variant="outlined" startIcon={<ImagePlus />} sx={{ mt: 1, borderRadius: 4, textTransform: "none", fontWeight: "bold", color: theme.palette.primary.main, borderColor: theme.palette.primary.main, "&:hover": { background: isDark ? "#1e293b" : "#e0f2fe" } }}>
                    Change Avatar
                    <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                  </Button>
                </Box>
              )}
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>{viewedUser.displayName}</Typography>
              <Typography variant="subtitle1">{viewedUser.email}</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Verification</Typography>
              <Typography>{viewedUser.verified ? "✅ Verified" : "❌ Not Verified"}</Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Organizations</Typography>
              {viewedUser.organizations && viewedUser.organizations.length > 0 ? (
                viewedUser.organizations.map((org: OrgMember, index: number) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography>Org ID: {org.orgId} — Member ID: {org.id}</Typography>
                    {org.roles && org.roles.length > 0 && (<Typography variant="body2" sx={{ ml: 2 }}>Roles: {org.roles.map((role) => role.name).join(", ")}</Typography>)}
                  </Box>
                ))
              ) : (<Typography>No organization memberships found.</Typography>)}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Projects</Typography>
              {viewedUser.projects && viewedUser.projects.length > 0 ? (
                viewedUser.projects.map((proj: ProjectMember, index: number) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography>Project ID: {proj.projectId} — Member ID: {proj.id}</Typography>
                    {proj.roles && proj.roles.length > 0 && (<Typography variant="body2" sx={{ ml: 2 }}>Roles: {proj.roles.map((role) => role.name).join(", ")}</Typography>)}
                  </Box>
                ))
              ) : (<Typography>No project memberships found.</Typography>)}
            </Box>

            {isOwnProfile && (
              <Box mt={5}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>Edit Your Profile</Typography>
                <Form />
              </Box>
            )}

            {isOwnProfile && (
              <Box mt={4} textAlign="center">
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" color="error" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
                  Danger Zone
                </Typography>
                <DeleteButton onClick={handleDeleteAccountRequest} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete My Account"}
                </DeleteButton>
              </Box>
            )}
          </motion.div>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmDialog && isOwnProfile && (
        <Box sx={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300}}>
          <Paper sx={{ padding: '30px', borderRadius: '8px', textAlign: 'center', background: theme.palette.background.paper, minWidth: '300px', maxWidth: '500px' }}>
            <Typography variant="h5" gutterBottom>Confirm Deletion</Typography>
            <Typography variant="body1" sx={{mb:3}}>Are you sure you want to permanently delete your account? This action cannot be undone.</Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
              <Button onClick={handleConfirmDeleteAccount} variant="contained" color="error" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
              <Button onClick={() => setShowDeleteConfirmDialog(false)} variant="outlined" disabled={isDeleting}>
                No, Cancel
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AboutUser;