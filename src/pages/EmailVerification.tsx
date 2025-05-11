import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  useTheme,
  Divider,
  useMediaQuery
} from "@mui/material";
import { motion } from "framer-motion";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NavBar from "../Components/Navbar/NavBar";
import { Mail } from "lucide-react";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";
  
  // Get email from state, localStorage, or use a generic message
  const email = location.state?.email || localStorage.getItem("userEmail") || "your email";
  
  // Store email in localStorage if it came from state
  useEffect(() => {
    if (location.state?.email) {
      localStorage.setItem("userEmail", location.state.email);
    }
    
    // Optional: Redirect if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [location.state, navigate]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

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
        maxWidth="sm"
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
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Box sx={{ mb: 3 }}>
                <Mail size={70} color="#38bdf8" strokeWidth={2} />
              </Box>
            </motion.div>
            
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: isDark ? "#f1f5f9" : "#0f172a"
              }}
              gutterBottom
            >
              Check Your Email
            </Typography>
            
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.85,
                color: isDark ? "#cbd5e1" : "#334155",
                mb: 2
              }}
            >
              We've sent a verification link to <strong>{email}</strong>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.75,
                color: isDark ? "#cbd5e1" : "#475569"
              }}
            >
              Please check your inbox and click the verification link to activate your account.
              If you don't see the email, please check your spam folder.
            </Typography>

            <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

            <Button
              variant="contained"
              size="large"
              onClick={handleGoToLogin}
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
              Return to Login
            </Button>
            
            <Typography
              variant="caption"
              sx={{
                mt: 4,
                display: "block",
                color: isDark ? "#64748b" : "#64748b",
                opacity: 0.6
              }}
            >
              Didn't receive an email? Check your spam folder or contact support.
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

export default EmailVerification;