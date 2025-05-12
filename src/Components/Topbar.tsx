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
import { getAllUsers, getUser } from "../utils/getters.utils";
import { User } from "../utils/types";

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
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [rawUser, setRawUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [test, setTest] = useState<String[]>([]);

  const navigate = useNavigate();

  // Adjust viewProfile function to go to the logged-in user's profile
  const viewProfile = (): void => {
  if (rawUser && rawUser.id) {
    navigate(`/user/${rawUser.id}/aboutUser`);
  } else {
    console.error("User data is not available. Cannot navigate to profile.");
  }
};


  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      console.log("[Search effect triggered] query:", searchQuery);
      
      if (searchQuery.trim() === "") {
        console.log("Query empty after trim. Clearing suggestions.");
        setUserSuggestions([]);
        return;
      }

      try {
        const result = await getAllUsers();
        console.log("Fetched user IDs:", result.data);

        if (!Array.isArray(result.data)) {
          navigate("/500");
          return;
        }

        const fullUsers: User[] = [];

        for (const userId of result.data) {
          try {
            const userRes = await getUser(userId);
            if (userRes?.data) {
              fullUsers.push(userRes.data);
            }
          } catch (err) {
            console.error(`Error getting user ${userId}`, err);
          }
        }

        let filtered = fullUsers.filter((user) => {
          return user.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        setUserSuggestions(filtered);
      } catch (error) {
        console.error("Error in search:", error);
        setUserSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, navigate]);

  console.log("userSuggestions:", userSuggestions[0]);

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
              color: theme.palette.mode === "dark" ? "#ffffff" : colors.grey[800],
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
    key={user.id}
    sx={{
      py: "8px",      // vertical padding
      pl: "16px",     // left padding for text alignment
      cursor: "pointer",
      textAlign: "left",
      color: theme.palette.mode === "dark" ? "#ffffff" : colors.grey[800],
      "&:hover": {
        backgroundColor: colors.primary[300],
      },
    }}
    onClick={() => {
      setSearchQuery("");
      setUserSuggestions([]);
      navigate(`/user/${user.id}/aboutUser`);
    }}
  >
    {user.name}
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

        <IconButton onClick={ () => { navigate("/activity",  {replace: true}) } }>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <Box
          position="relative"
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          <IconButton aria-label="Profile Icon" onClick={() => {
            const userid = localStorage.getItem("userid");
            navigate(`/user/${userid}/aboutUser`, {replace: true});
          }}>
           <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;