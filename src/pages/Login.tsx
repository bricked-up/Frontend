import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import usePasswordValidation from "../hooks/usePasswordValidation";
import { authUser } from "../utils/loginPage.utils";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Container,
  Alert,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import NavBar from "../Components/Navbar/NavBar";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * TabPanel component for switching between login and signup forms
 */
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Login component provides UI for logging into an existing account or signing up for a new account.
 */
const Login = () => {
  const { user, setUser } = useUser();
  const [password, setPassword] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [registerAttempt, setRegisterAttempt] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  // Password validation hook (using functionality from first file)
  const { isValid, errors } = usePasswordValidation({
    password,
    confirmpwd,
    minLength: 8,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setRegisterAttempt(false);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const { status } = await authUser(account, password, "login");

      if (status === 200) {
        navigate("/dashbourd");
      } else if (status === 401) {
        setError("Invalid email or password");
      } else if (status === 500) {
        navigate("/500");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      navigate("/500");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterAttempt(true);
    if (!isValid) return;

    try {
      const { status } = await authUser(account, password, "signup");

      if (status === 200) {
        // Redirect to verification page after successful signup
        navigate("/verification");
      } else if (status === 409) {
        setError("Email already exists");
      } else if (status === 500) {
        navigate("/500");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      navigate("/500");
    }
  };

  // Inverted text field styling for both light and dark modes
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
      color: isDark ? "#f1f5f9" : "#0f172a",
      "& fieldset": {
        borderColor: isDark
          ? "rgba(203, 213, 225, 0.3)"
          : "rgba(15, 23, 42, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: isDark
          ? "rgba(203, 213, 225, 0.5)"
          : "rgba(15, 23, 42, 0.3)",
      },
      "&.Mui-focused fieldset": {
        borderColor: isDark ? "#60a5fa" : "#2563eb",
      },
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "rgba(203, 213, 225, 0.7)" : "rgba(15, 23, 42, 0.7)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: isDark ? "#60a5fa" : "#2563eb",
    },
    "& .MuiInputBase-input": {
      "&::placeholder": {
        color: isDark ? "rgba(203, 213, 225, 0.5)" : "rgba(15, 23, 42, 0.5)",
        opacity: 1,
      },
    },
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
        transition: "background 0.5s ease, color 0.5s ease",
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
              transition: "all 0.4s ease-in-out",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: isDark ? "#f1f5f9" : "#0f172a",
                mb: 3,
              }}
            >
              Welcome to Bricked Up!
            </Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  background: "linear-gradient(to right, #0ea5e9, #6366f1)",
                },
                mb: 2,
              }}
            >
              <Tab
                label="Login"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: isDark ? "#cbd5e1" : "#334155",
                  "&.Mui-selected": {
                    color: isDark ? "#f1f5f9" : "#0f172a",
                  },
                }}
              />
              <Tab
                label="Sign Up"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: isDark ? "#cbd5e1" : "#334155",
                  "&.Mui-selected": {
                    color: isDark ? "#f1f5f9" : "#0f172a",
                  },
                }}
              />
            </Tabs>

            {/* Login Form */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  required
                  id="login-email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  required
                  id="login-password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={textFieldSx}
                />

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      bgcolor: isDark
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(239, 68, 68, 0.08)",
                      color: isDark ? "#fca5a5" : "#b91c1c",
                      "& .MuiAlert-icon": {
                        color: isDark ? "#f87171" : "#ef4444",
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 8,
                    fontWeight: "bold",
                    textTransform: "none",
                    background: "linear-gradient(to right, #0ea5e9, #6366f1)",
                    color: "#fff",
                    boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)",
                    filter: "drop-shadow(0 0 0.75rem rgba(99, 102, 241, 0.5))",
                    "&:hover": {
                      background: "linear-gradient(to right, #6366f1, #0ea5e9)",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </TabPanel>

            {/* Sign Up Form */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSignup}>
                <TextField
                  fullWidth
                  required
                  id="signup-email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  required
                  id="signup-password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  required
                  id="signup-password-confirm"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={confirmpwd}
                  onChange={(e) => setConfirmpwd(e.target.value)}
                  error={registerAttempt && !isValid && password !== confirmpwd}
                  helperText={
                    registerAttempt && password !== confirmpwd
                      ? "Passwords don't match"
                      : ""
                  }
                  sx={{
                    ...textFieldSx,
                    "& .MuiFormHelperText-root": {
                      color: isDark ? "#f87171" : "#ef4444",
                    },
                  }}
                />

                {registerAttempt && errors.length > 0 && (
                  <Alert
                    severity="warning"
                    sx={{
                      mt: 2,
                      bgcolor: isDark
                        ? "rgba(245, 158, 11, 0.1)"
                        : "rgba(245, 158, 11, 0.08)",
                      color: isDark ? "#fcd34d" : "#92400e",
                      "& .MuiAlert-icon": {
                        color: isDark ? "#fbbf24" : "#f59e0b",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: isDark ? "#fcd34d" : "#92400e",
                      }}
                    >
                      Password requirements:
                    </Typography>
                    <List dense disablePadding>
                      {errors.map((err, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={err}
                            sx={{
                              "& .MuiListItemText-primary": {
                                color: isDark ? "#fcd34d" : "#92400e",
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}

                {registerAttempt && isValid && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 2,
                      bgcolor: isDark
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(34, 197, 94, 0.08)",
                      color: isDark ? "#86efac" : "#166534",
                      "& .MuiAlert-icon": {
                        color: isDark ? "#4ade80" : "#22c55e",
                      },
                    }}
                  >
                    All requirements met!
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 8,
                    fontWeight: "bold",
                    textTransform: "none",
                    background: "linear-gradient(to right, #0ea5e9, #6366f1)",
                    color: "#fff",
                    boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)",
                    filter: "drop-shadow(0 0 0.75rem rgba(99, 102, 241, 0.5))",
                    "&:hover": {
                      background: "linear-gradient(to right, #6366f1, #0ea5e9)",
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            </TabPanel>

            <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

            <Typography
              variant="subtitle2"
              sx={{
                fontStyle: "italic",
                opacity: 0.65,
                color: isDark ? "#94a3b8" : "#475569",
              }}
            >
              "Start collaborating and organizing with your team today!"
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
          transition: "color 0.4s ease, border-color 0.4s ease",
        }}
      >
        © 2025 Bricked Up, Inc. · Privacy · Terms
      </Box>
    </Box>
  );
};
export default Login;