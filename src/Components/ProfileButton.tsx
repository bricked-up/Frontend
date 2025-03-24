import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../css/ProfileButton.css";

const ProfileButton: React.FC = () => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        "&:hover": {
          backgroundColor: theme.palette.neutral.dark,
        },
      }}
    >
      👤
    </Button>
  );
};

export default ProfileButton;
