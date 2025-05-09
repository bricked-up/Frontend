import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  useTheme,
  Alert
} from "@mui/material";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NavBar from "../Components/Navbar/NavBar";

/**
 * EmailVerification component displays a confirmation page after signup
 * informing the user to check their email for verification.
 * 
 * The component shows a confirmation message with instructions and
 * provides a button to redirect to the login page.
 * 
 * @component
 * @example
 * return(
 *  <EmailVerification />
 * );
 */
const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get email from state if available
  const email = location.state?.email || "your email";

  const handleGoToLogin = () => {
    navigate("/login");
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
            textAlign: "center",
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(30, 40, 70, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <MarkEmailReadIcon 
            color="primary" 
            sx={{ fontSize: 80, mb: 2 }} 
          />
          
          <Typography 
            variant="h4" 
            component="h1" 
            color="primary"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Verify Your Email
          </Typography>

          <Typography variant="body1" paragraph>
            We've sent a verification link to <strong>{email}</strong>
          </Typography>
          
          <Typography variant="body1" paragraph>
            Please check your inbox and click the verification link to activate your account.
            If you don't see the email, please check your spam folder.
          </Typography>

          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              mb: 3, 
              textAlign: "left",
              display: "flex",
              alignItems: "center"
            }}
          >
            You need to verify your email before you can log in to your account.
          </Alert>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleGoToLogin}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailVerification;