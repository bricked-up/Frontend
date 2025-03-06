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
