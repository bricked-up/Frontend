import React, { useState, useContext, useEffect } from "react";
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


interface TopbarProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

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
const Topbar: React.FC<TopbarProps> = ({ setIsSidebar, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // State to control visibility of the logout popup
  const [showLogout, setShowLogout] = useState(false);

  // For redirecting the user after logout (if desired)
  const navigate = useNavigate();

  // New states for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

  /**
   * Calls the `logout()` function to remove user data (e.g., from localStorage/cookies),
   * then navigates the user back to the home page ("/").
   *
   * @function viewProfile
   * @returns {void}
   */
  const viewProfile = (): void => {
    navigate("/user/:'userId/aboutUser");
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim() !== "") {
        try {
          const response = await fetch(`/api/users/search?q=${searchQuery}`);
          const data = await response.json();
          setUserSuggestions(data.users || []);
        } catch (error) {
          console.error("Search failed:", error);
          setUserSuggestions([]);
        }
      } else {
        setUserSuggestions([]);
      }
    }, 300); // 300ms delay after typing

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

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
         position="relative"
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: colors.primary[400],
          color: theme.palette.text.primary, 
          borderRadius: "3px",
          ml: 5,
          paddingX: 1,
        }}
>
        <Box display="flex">
        <InputBase
          sx={{
          ml: 2,
          flex: 1,
          color: theme.palette.text.primary, 
         }}
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />

          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Suggestions dropdown */}
        {userSuggestions.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: "48px",
              left: 0,
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: "0 0 4px 4px",
              boxShadow: 3,
              zIndex: 5,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {userSuggestions.map((user) => (
              <Box
                key={user.username}
                sx={{
                  padding: "8px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: colors.primary[300],
                  },
                }}
                onClick={() => {
                  setSearchQuery("");
                  setUserSuggestions([]);
                  navigate(`/about-user/${user.username}`);
                }}
              >
                {user.username}
              </Box>
            ))}
          </Box>
        )}
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

          {/**
           * Logout button dropdown:
           *
           * Displays a red "Logout" button with curved edges when the user
           * hovers over the Person icon. Clicking it triggers handleLogout().
           *
           * @name LogoutButton
           * @description
           *   A hover-triggered button that clears session data via `logout()`
           *   and redirects the user to the homepage.
           */}
          {showLogout && (
            <Box
              position="absolute"
              top="40px"
              right="0"
              p={0}
              border="none"
              bgcolor="transparent"
            >
              <button
                onClick={viewProfile}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                View Profile
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
