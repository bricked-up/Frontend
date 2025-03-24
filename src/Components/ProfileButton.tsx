import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "../css/ProfileButton.css";
import { useUser } from "../hooks/UserContext";
import { logout } from "../utils/account.utils";


const ProfileButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

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
      <Button
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
        onClick={() => navigate(`/users/${user.email}`)}
      >
        👤
      </Button>

      {isHovered && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            mt: 1,
            zIndex: 10,
          }}
        >
          <Button
            onMouseLeave={() => setIsHovered(false)}
            variant="contained"
            color="error"
            onClick={() => {
              logout();
              window.location.href = "/";
            }
            }
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProfileButton;
