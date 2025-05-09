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
import Form from "../Components/AccountPage/Form";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { getUser } from "../utils/getters.utils"; // Adjust the import path as necessary
import { User, OrgMember, ProjectMember } from "../utils/types";
import NavBar from "../Components/Navbar/NavBar"; // Import NavBar

const AboutUser: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, setUser } = useUser();
  const { userId } = useParams();
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const confirmationShown = useRef(false); // Ref to track if confirmation has been shown

  const isDark = theme.palette.mode === "dark";

/** Real Backend UseEffect Replacing Mock Logic */
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
      setIsLoaded(true);
    }
  }, 5000);

  if (!userId) {
    clearTimeout(timeoutId);
    return;
  }

  const fetchAndSetUser = async () => {
    try {
      const fetchedUser = await fetchUserData(userId, "update");

      if (!fetchedUser) {
        if (!confirmationShown.current) {
          confirmationShown.current = true;
          const confirmed = window.confirm(
            "User does not exist. Click OK to return to home page."
          );
          if (confirmed) {
            navigate("/");
          }
        }
        setIsLoaded(true);
        return;
      }

      setViewedUser(fetchedUser);
      setIsOwnProfile(user && fetchedUser.id === user.id);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading user data:", error);
      if (!confirmationShown.current) {
        confirmationShown.current = true;
        const confirmed = window.confirm(
          "Error loading user data. Click OK to return to home page."
        );
        if (confirmed) {
          navigate("/");
        }
      }
      setIsLoaded(true);
    }
  };

  fetchAndSetUser();

  return () => clearTimeout(timeoutId);
}, [userId, user, navigate, isLoaded]);

  /** File Upload Handler Start */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return; // Ensure only own profile can update avatar
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      if (user) {
        setUser({ ...user, avatar: imageUrl }); // Update user avatar with selected image
      }
    }
  };
  /** File Upload Handler End */

  if (!isLoaded) return <LoadingPage />;
  if (!viewedUser) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: theme.palette.background.paper,
          boxShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.5)"
            : "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <NavBar />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        width="100%"
        mt={4}
        px={2}
      >
        <Paper
          elevation={8}
          sx={{
            width: { xs: "95%", md: "600px" },
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: isDark
              ? "rgba(30, 41, 59, 0.7)"
              : "rgba(255, 255, 255, 0.85)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? "0 8px 24px rgba(0,0,0,0.3)"
              : "0 6px 16px rgba(0,194,255,0.15)",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <img
                src={viewedUser.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${isDark ? "#38bdf8" : "#6366f1"}`,
                  marginBottom: "1rem",
                }}
              />
              {isOwnProfile && (
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImagePlus />}
                    sx={{
                      mt: 1,
                      borderRadius: 4,
                      textTransform: "none",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      "&:hover": {
                        background: isDark ? "#1e293b" : "#e0f2fe",
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
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                {viewedUser.displayName}
              </Typography>
              <Typography variant="subtitle1">{viewedUser.email}</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Verification
              </Typography>
              <Typography>{viewedUser.verified ? "✅" : "❌"}</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Organizations
              </Typography>
              {viewedUser.organizations &&
              viewedUser.organizations.length > 0 ? (
                viewedUser.organizations.map(
                  (org: OrgMember, index: number) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography>
                        Org ID: {org.orgId} — Member ID: {org.id}
                      </Typography>
                      {org.roles && org.roles.length > 0 && (
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          Roles: {org.roles.map((role) => role.name).join(", ")}
                        </Typography>
                      )}
                    </Box>
                  )
                )
              ) : (
                <Typography>No organization memberships found.</Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Projects
              </Typography>
              {viewedUser.projects && viewedUser.projects.length > 0 ? (
                viewedUser.projects.map(
                  (proj: ProjectMember, index: number) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography>
                        Project ID: {proj.projectId} — Member ID: {proj.id}
                      </Typography>
                      {proj.roles && proj.roles.length > 0 && (
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          Roles: {proj.roles.map((role) => role.name).join(", ")}
                        </Typography>
                      )}
                    </Box>
                  )
                )
              ) : (
                <Typography>No project memberships found.</Typography>
              )}
            </Box>

            {isOwnProfile && (
              <Box mt={5}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
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

async function fetchUserData(userId: string, arg1: string): Promise<User | null> {
  try {
    const result = await getUser(parseInt(userId, 10)); 
    // getUser now returns an object with status, data, and error
    
    if (result.status !== 200 || !result.data) {
      // If the status is not OK or the data is null, return null
      return null;
    }
    
    const userData = result.data;

    return {
      id: userData.id,
      displayName: userData.displayName || '',
      email: userData.email || '',
      name: userData.name || '',
      password: userData.password || '',
      verified: userData.verified || false,
      avatar: userData.avatar || '',
      organizations: userData.organizations || [],
      projects: userData.projects || []
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}