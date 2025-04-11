import React, { useState, useContext } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/account.utils";

/**
 * The topbar component
 *
 * This component represents the top navigation bar of our app.
 * It contains:
 * - A **search bar** to find specific content.
 * - A **theme toggle button** for switching between light and dark modes.
 * - Icons for **notifications, settings, and user profile**. (might change notifications)
 *
 * @component
 * @example
 * <Topbar setIsSidebar={setIsSidebar} setIsCollapsed={setIsCollapsed} />
 *
 * @param {Object} props - The component props.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsSidebar - Function to toggle sidebar visibility.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsCollapsed - Function to collapse or expand the sidebar.
 *
 * @returns {JSX.Element} The Topbar component.
 */

interface TopbarProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: React.FC<TopbarProps> = ({ setIsSidebar, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // State to control visibility of the logout popup
  const [showLogout, setShowLogout] = useState(false);

  // For redirecting the user after logout (if desired)
  const navigate = useNavigate();

  // Handle the actual logout logic plus optional redirect
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      height="64px"
      alignItems="center"
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "3px",
          ml: 5,
          paddingX: 1,
        }}
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* Container holding Person Icon + Logout Menu.
            Mouse leaves this box => hide the menu. */}
        <Box
          position="relative"
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          <IconButton aria-label="Profile Icon">
            <PersonOutlinedIcon />
          </IconButton>

          {/* Conditionally render the Logout button below the icon */}
          {showLogout && (
            <Box
              position="absolute"
              top="40px"
              right="0"
              // Remove padding and border for an "invisible" surrounding area
              p={0}
              border="none"
              bgcolor="transparent"
            >
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  cursor: "pointer",
                  // Make the edges curved
                  borderRadius: "4px",
                }}
              >
                Logout
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
