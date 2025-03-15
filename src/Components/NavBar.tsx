import React, { useContext } from "react";
import "../css/NavBar.css";
import HomeButton from "./HomeButton";
import { useUser } from "../hooks/UserContext";
import ThemeToggleButton from "./ThemeToggleButton";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";
import { ThemeContext } from "./ThemeProvider";
import { useTheme } from "@mui/material/styles";
import logo from '../assets/BrickedUpLogo.png';
import { useNavigate } from "react-router-dom";

/**
 * NavBar Component for Bricked Up
 *
 * Renders the navigation bar with the company logo, company name, and action buttons.
 * The action buttons include Profile, Login, Theme Toggle, and Home.
 * The background color is dynamically set using the current theme's palette
 * (using background.paper to distinguish it from the main page background).
 *
 * @component
 *
 * @returns {JSX.Element}
 * 
 * @example
 * <NavBar />
 * 
 */
const NavBar: React.FC = () => {
  const { user } = useUser(); // Get the current user from context
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: theme.palette.background.paper,
      }}>
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo" />
        <span className="company-name">Bricked Up</span>
      </div>
      <div className="actions">
        <ThemeToggleButton toggleTheme={toggleTheme} />
        <HomeButton />
        {user && user.email ? <ProfileButton /> : <LoginButton />}
      </div>
    </nav>
  );
};

export default NavBar;
