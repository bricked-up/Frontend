/**
 * AboutUser.tsx
 *
 * This component displays user profile information.
 * If the logged-in user is viewing their own profile, they can edit their avatar and account details.
 * Fetches user data based on the userId from the URL. If loading exceeds 5 seconds, the user is redirected.
 */

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { fetchUserData } from "../utils/account.utils";
import LoadingPage from "./LoadingPage";
import Form from "../Components/AccountPage/Form";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

/**
 * Renders the user profile page.
 * Allows avatar update and access to the account form if viewing own profile.
 * Redirects on timeout or error.
 */
const AboutUser: React.FC = () => {
  const { user, setUser } = useUser();
  const { userId } = useParams();
  const [viewedUser, setViewedUser] = useState<typeof user | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      window.alert("Request timed out. Please try again later.");
      navigate("/");
    }, 5000);

    const fetchAndSetUser = async () => {
      if (!userId) return;

      try {
        const fetchedUser = await fetchUserData(userId, "update");

        if (!fetchedUser) {
          window.alert("User does not exist");
          navigate("/login");
          return;
        }

        setViewedUser(fetchedUser);
        setIsOwnProfile(fetchedUser.email === user.email);
        setIsLoaded(true);
        clearTimeout(timeout);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Fetch error:", error);
          window.alert("Failed to fetch user. Redirecting...");
          navigate("/");
        }
      }
    };

    fetchAndSetUser();

    return () => clearTimeout(timeout);
  }, [userId, user, navigate]);

  /**
   * Handles avatar file upload for the user's own profile.
   * @param e - The change event triggered by file input
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return; // only allow for own profile
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, avatar: imageUrl });
    }
  };

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!viewedUser) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0f172a, #1e293b, #334155)"
          : "linear-gradient(135deg, #e0f2fe, #f1f5f9, #f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: { xs: "90%", md: "60%" },
          p: 6,
          borderRadius: 6,
          backdropFilter: "blur(16px)",
          background: isDark
            ? "rgba(30, 41, 59, 0.7)"
            : "rgba(255, 255, 255, 0.8)",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? "0 12px 32px rgba(0,0,0,0.3)"
            : "0 8px 20px rgba(0,194,255,0.15)",
          textAlign: "center",
          transition: "all 0.4s ease-in-out",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ mb: 4 }}>
            <img
              src={viewedUser.avatar || "https://via.placeholder.com/150"}
              alt="Profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                border: `3px solid ${isDark ? "#38bdf8" : "#6366f1"}`,
              }}
            />
            {isOwnProfile && (
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<ImagePlus />}
                  sx={{
                    mt: 2,
                    borderRadius: 6,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    textTransform: "none",
                    fontWeight: "bold",
                    '&:hover': {
                      background: isDark ? "#1e293b" : "#e0f2fe"
                    }
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
          </Box>

          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
            {viewedUser.displayName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: isDark ? "#cbd5e1" : "#334155", mt: 1 }}>
            {viewedUser.email}
          </Typography>

          {isOwnProfile && (
            <Box mt={6}>
              <Form />
            </Box>
          )}
        </motion.div>
      </Paper>
    </Box>
  );
};

export default AboutUser;