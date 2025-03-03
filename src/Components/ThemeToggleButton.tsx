import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../css/ThemeToggleButton.css";

interface ThemeToggleButtonProps {
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      onClick={toggleTheme}
      sx={{
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }}
    >
      Change Theme
    </Button>
  );
};

export default ThemeToggleButton;
