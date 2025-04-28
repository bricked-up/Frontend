import React from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { motion } from "framer-motion";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"; // <-- using your original icon

const ProfileButton: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Button
        variant="contained"
        onClick={() => navigate(`/user/${user.email}/about`)} // fixed your routing pattern
        startIcon={<PersonOutlinedIcon />}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 6,
          background: "linear-gradient(to right, #0ea5e9, #6366f1)",
          color: "#fff",
          fontWeight: "bold",
          textTransform: "none",
          boxShadow: "0 6px 16px rgba(14, 165, 233, 0.4)",
          '&:hover': {
            background: "linear-gradient(to right, #6366f1, #0ea5e9)",
          }
        }}
      >
        My Profile
      </Button>
    </motion.div>
  );
};

export default ProfileButton;