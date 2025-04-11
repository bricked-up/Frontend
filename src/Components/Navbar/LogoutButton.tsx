import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/account.utils'; // Adjust path based on your directory structure
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../../css/LoginButton.css";

/**
 * A button that, when clicked, logs out the user and redirects them
 * to the home page. Uses window.location.href for navigation rather
 * than react-router's navigate.
 *
 * @component
 * @example
 * return (
 *   <LogoutButton />
 * );
 *
 * @returns {JSX.Element} The rendered logout button.
 */
const LogoutButton = () => {
  const navigate = useNavigate();

  /**
   * Logs out the user by clearing their session (e.g., localStorage/cookies)
   * and then redirects the user to the home page.
   *
   * @function handleLogout
   * @returns {void}
   */
  const handleLogout = (): void => {
    logout();
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
