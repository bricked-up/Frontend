import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../css/HomeButton.css";

/**
 * A button component that navigates the user to the home page.
 *
 * @component
 * @returns {JSX.Element} 
 * @example
 * <HomeButton />
 */
const HomeButton: React.FC = () => {
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
      onClick={() => {
        window.location.href = "/";
      }}
    >
      Home
    </Button>
  );
};

export default HomeButton;
