// src/Components/Navbar/ProfileButton.tsx
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "../../css/ProfileButton.css"; // Ensure this path is correct and the file exists
import { useUser } from "../../hooks/UserContext"; // Ensure this path is correct
import { logout } from "../../utils/account.utils"; // Ensure this path is correct
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { motion } from "framer-motion"; // Added framer-motion back

const ProfileButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const { user } = useUser(); // user can be User | null
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Check if user and user.id exist before navigating.
    // Your App.tsx routes user profiles by :userId, which should typically be user.id.
    if (user && typeof user.id === 'number') {
      navigate(`/user/${user.id}/about`);
    } else if (user && user.email) {
      // Fallback or alternative if your routes are set up to use email for some reason
      // console.warn("Navigating with email as fallback, ensure routes match this pattern if intended.");
      // navigate(`/user/${user.email}/about`); // Uncomment if you need to use email
      console.warn("User ID is not available to navigate to profile. User email:", user.email);
    }
    else {
      console.warn("User data is not available to navigate to profile.");
      // Optionally, navigate to login if user is not available
      // navigate('/login');
    }
  };

  return (
    <motion.div // Added framer-motion wrapper back
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ position: 'relative' }} // For positioning the logout button
      >
        <Button
          variant="contained"
          onClick={handleProfileClick} // Click handler on the main button
          startIcon={<PersonOutlinedIcon />}
          sx={{
            // Merging your preferred styling:
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
            },
            // Original styling for reference if needed:
            // backgroundColor: theme.palette.secondary.main,
            // "&:hover": {
            //   backgroundColor: theme.palette.primary.dark,
            // },
            // display: 'flex', // Already handled by Button with startIcon
            // alignItems: 'center',
          }}
        >
          My Profile {/* Restored "My Profile" text */}
        </Button>

        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              top: "100%", // Position below the profile button
              right: 0,    // Align to the right
              mt: 0.5,     // Small margin top
              zIndex: 10,
            }}
          >
            <Button
              variant="contained"
              color="error" // MUI's error color (typically red)
              onClick={() => {
                logout();
                navigate("/login");
              }}
              sx={{
                // Styling for the logout button if needed
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default ProfileButton;
