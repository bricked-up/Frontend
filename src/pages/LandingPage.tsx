import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../Components/Navbar/NavBar";
import { StickyNote, Calendar, Mail } from "lucide-react";

const features = [
  {
    icon: <StickyNote size={40} strokeWidth={2} color="#38bdf8" />,
    title: "Smart Notes",
    text: "Jot down thoughts, tasks, and ideas effortlessly."
  },
  {
    icon: <Calendar size={40} strokeWidth={2} color="#38bdf8" />,
    title: "Integrated Calendar",
    text: "Keep your schedule aligned with your tasks."
  },
  {
    icon: <Mail size={40} strokeWidth={2} color="#38bdf8" />,
    title: "Email Sync",
    text: "Get notified and stay connected with updates."
  }
];

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        background: isDark
          ? "linear-gradient(135deg, #0f172a, #1e293b, #334155)"
          : "linear-gradient(135deg, #e0f2fe, #f1f5f9, #f8fafc)",
        color: theme.palette.text.primary,
        transition: "background 0.5s ease, color 0.5s ease"
      }}
    >
      <NavBar />

      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={8}
            sx={{
              backdropFilter: "blur(16px)",
              background: isDark
                ? "rgba(30, 41, 59, 0.7)"
                : "rgba(255, 255, 255, 0.8)",
              borderRadius: 6,
              p: { xs: 4, sm: 6 },
              width: "100%",
              textAlign: "center",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: isDark
                ? "0 12px 32px rgba(0, 0, 0, 0.3)"
                : "0 8px 20px rgba(0, 194, 255, 0.15)",
              transition: "all 0.4s ease-in-out"
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: isDark ? "#f1f5f9" : "#0f172a"
              }}
              gutterBottom
            >
              Collaborate, Plan, and Track — All in One Place
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.85,
                color: isDark ? "#cbd5e1" : "#334155"
              }}
            >
              Bricked Up helps teams stay organized with smart notes, calendar integration,
              and seamless communication.
            </Typography>

            <Box mt={4}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: "bold",
                  textTransform: "none",
                  background: "linear-gradient(to right, #0ea5e9, #6366f1)",
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)",
                  filter: "drop-shadow(0 0 0.75rem rgba(99, 102, 241, 0.5))",
                  '&:hover': {
                    background: "linear-gradient(to right, #6366f1, #0ea5e9)"
                  }
                }}
              >
                Get Started
              </Button>
            </Box>

            <Divider sx={{ my: 5, borderColor: theme.palette.divider }} />

            <Grid container spacing={4} justifyContent="center">
              {features.map(({ icon, title, text }) => (
                <Grid item xs={12} sm={4} key={title}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ textAlign: "center" }}
                  >
                    <Box sx={{ mb: 2 }}>{icon}</Box>
                    <Typography variant="h6" fontWeight="medium" sx={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.7, color: isDark ? "#cbd5e1" : "#475569" }}>
                      {text}
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 5, borderColor: theme.palette.divider }} />

            <Typography
              variant="subtitle2"
              sx={{
                fontStyle: "italic",
                opacity: 0.65,
                color: isDark ? "#94a3b8" : "#475569"
              }}
            >
              "I'm hella Bricked Up, but I love it!"
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                color: isDark ? "#64748b" : "#64748b"
              }}
            >
              — Kamran Abbasli, CEO of George King IT
            </Typography>
          </Paper>
        </motion.div>
      </Container>

      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 2,
          fontSize: "0.9rem",
          opacity: 0.4,
          color: theme.palette.text.secondary,
          borderTop: `1px solid ${theme.palette.divider}`,
          transition: "color 0.4s ease, border-color 0.4s ease"
        }}
      >
        © 2025 Bricked Up, Inc. · Privacy · Terms
      </Box>
    </Box>
  );
};

export default LandingPage;
