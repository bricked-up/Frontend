import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "../css/LoginButton.css";

const LoginButton: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // initialize the navigation hook

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }}
      onClick={() => navigate("/login")} // navigate to the login page when clicked
    >
      Log In
    </Button>
  );
};

export default LoginButton;
