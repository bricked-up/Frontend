import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../../css/HomeButton.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }}
      onClick={() => {
        navigate("/");
      }}
    >
      Home
    </Button>
  );
};

export default HomeButton;
