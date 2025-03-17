import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "../css/ProfileButton.css";
import { useUser } from "../hooks/UserContext";

const ProfileButton: React.FC = () => {
  const theme = useTheme();
  const { user } = useUser();

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
      👤
    </Button>
  );
};

export default ProfileButton;
