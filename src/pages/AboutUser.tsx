import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, useTheme, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import LoadingPage from "./LoadingPage";
import Form from "../Components/AccountPage/Form";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

import mockUsers from "../utils/mockUserData";
import { User, OrgMember, ProjectMember } from "../utils/types";
import NavBar from "../Components/Navbar/NavBar";

const AboutUser: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, setUser } = useUser();
  const { userId } = useParams();
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const isDark = theme.palette.mode === "dark";

  /** Mock Data UseEffect Start */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        window.alert("Unable to load user profile. Please try again later.");
        navigate("/");
      }
    }, 5000);

    if (!userId) {
      clearTimeout(timeoutId);
      return;
    }

    try {
      const id = parseInt(userId, 10); // Convert userId to number
      const fetchedUser = mockUsers.find((u) => u.id === id);

      if (!fetchedUser) {
        window.alert("User does not exist");
        navigate("/login");
        return;
      }

      setViewedUser(fetchedUser);
      setIsOwnProfile(user && fetchedUser.id === user.id); // Check if viewing own profile
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading user data:", error);
      window.alert("Error loading user data. Please try again.");
      navigate("/");
    }

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [userId, user, navigate, isLoaded]);
  /** Mock Data UseEffect End */

  /** Real Backend UseEffect (Commented out for now) */
  // useEffect(() => {
  //   const fetchAndSetUser = async () => {
  //     if (!userId) return;
  //     const fetchedUser = await fetchUserData(userId, "update");
  //     if (!fetchedUser) {
  //       window.alert("User does not exist");
  //       navigate("/login");
  //       return;
  //     }
  //     setViewedUser(fetchedUser);
  //     setIsOwnProfile(fetchedUser.id === user.id);
  //     setIsLoaded(true);
  //   };
  //   fetchAndSetUser();
  // }, [userId, user, navigate]);
  /** Real Backend UseEffect End */

 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return; // Ensure only own profile can update avatar
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      if (user) {
        setUser({ ...user, avatar: imageUrl }); // Update user avatar with selected image
      }
    }
  };

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
          boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 6px rgba(0,0,0,0.1)",
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
                    <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
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
              {viewedUser.organizations && viewedUser.organizations.length > 0 ? (
                viewedUser.organizations.map((org: OrgMember, index: number) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography>
                      Org ID: {org.orgId} — Member ID: {org.id}
                    </Typography>
                    {org.roles && org.roles.length > 0 && (
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Roles:{" "}
                        {org.roles.map((role) => role.name).join(", ")}
                      </Typography>
                    )}
                  </Box>
                ))
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
                viewedUser.projects.map((proj: ProjectMember, index: number) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography>
                      Project ID: {proj.projectId} — Member ID: {proj.id}
                    </Typography>
                    {proj.roles && proj.roles.length > 0 && (
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Roles:{" "}
                        {proj.roles.map((role) => role.name).join(", ")}
                      </Typography>
                    )}
                  </Box>
                ))
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