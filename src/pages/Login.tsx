import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import usePasswordValidation from "../hooks/usePasswordValidation";
import authUser from "../utils/loginPage.utils";

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Container,
  Link,
  Alert,
  List,
  ListItem,
  ListItemText,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
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
 * It toggles between the login and sign-up forms based on tab selection.
 *
 * For the signup form, it checks for password requirements (minimum nr of chars,
 * uppercase/lowercase symbols, special chars etc) as well as validates the
 * confirm password choice.
 *
 * The component uses a custom React hook (`usePasswordValidation`) for validating
 * the password against required criteria.
 *
 * @component
 * @example
 * return(
 *  <Login />
 * );
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

  // Password validation hook
  const { isValid, errors } = usePasswordValidation({
    password: password,
    confirmpwd: confirmpwd,
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

  const handleForgotPwd = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!account) {
      e.preventDefault();
      setError("No account registered!");
    } else {
      setError("");
    }
  };

  const handleLogin = async () => {
    const response = await authUser(account, password, "login");
    if (response === 500) {
      navigate("/500");
    }
    if (response === 200) {
      setUser({ ...user, email: account });
      navigate("/dashboard");
    }
  };

  const handleSignup = async () => {
    setRegisterAttempt(true);
    if (isValid) {
      const response = await authUser(account, password, "signup");
      if (response === 500) {
        navigate("/500");
      }
      if (response === 200) {
        setUser({ ...user, email: account });
        navigate("/dashboard");
      }
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        width: "100%", 
        bgcolor: theme.palette.background.default 
      }}
    >
      <NavBar />
      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(30, 40, 70, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            color="primary"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Welcome to Bricked Up!
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
              },
              mb: 2
            }}
          >
            <Tab 
              label="Login" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            />
            <Tab 
              label="Sign Up" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            />
          </Tabs>

          {/* Login Form */}
          <TabPanel value={tabValue} index={0}>
            <Box component="form">
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
              />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
              >
                Login
              </Button>
              
              <Box textAlign="center">
                <Link 
                  href="/forgot_pwd" 
                  onClick={handleForgotPwd}
                  underline="hover"
                  sx={{ display: 'inline-block', mt: 1 }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </TabPanel>

          {/* Sign Up Form */}
          <TabPanel value={tabValue} index={1}>
            <Box component="form">
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
                helperText={registerAttempt && password !== confirmpwd ? "Passwords don't match" : ""}
              />
              
              {registerAttempt && errors.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Password requirements:
                  </Typography>
                  <List dense disablePadding>
                    {errors.map((err, index) => (
                      <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                        <ListItemText primary={err} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
              
              {registerAttempt && isValid && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  All requirements met!
                </Alert>
              )}
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignup}
              >
                Register
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;