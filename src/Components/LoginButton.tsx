import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../css/LoginButton.css";

const LoginButton: React.FC = () => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }}
    >
      Log In
    </Button>
  );
};

export default LoginButton;

