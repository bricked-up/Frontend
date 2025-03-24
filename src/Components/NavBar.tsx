import React from "react";
import "../css/NavBar.css";
import HomeButton from "./HomeButton";
import { useUser } from "../hooks/UserContext";
import ThemeToggleButton from "./ThemeToggleButton";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/BrickedUpLogo.png";

/**
 * NavBar Component for Bricked Up
 *
 * Renders the navigation bar with the company logo, company name, and action buttons.
 * The action buttons include Theme Toggle, Home, and either Profile (if logged in)
 * or Login (if not logged in).
 * The background color is dynamically set using the current theme's palette
 * (using background.paper to distinguish it from the main page background).
 *
 * @component
 *
 * @returns {JSX.Element}
 *
 * @example
 * <NavBar />
 */
const NavBar: React.FC = () => {
  const { user } = useUser(); // Get the current user from context
  const theme = useTheme();

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo" />
        <span className="company-name" style={{ color: theme.palette.text.secondary}}>Bricked Up</span>
      </div>
      <div className="actions">
        <ThemeToggleButton />
        <HomeButton />
        {user && user.email ? <ProfileButton /> : <LoginButton />}
      </div>
    </nav>
  );
};

export default NavBar;
