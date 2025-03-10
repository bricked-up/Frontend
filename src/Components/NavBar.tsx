import React, { useContext } from "react";
import "../css/NavBar.css";
import HomeButton from "./HomeButton";
import ThemeToggleButton from "./ThemeToggleButton";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";
import { ThemeContext } from "./ThemeProvider"; 
import { useTheme } from "@mui/material/styles";
import logo from '../assets/BrickedUpLogo.png';


const NavBar: React.FC = () => {
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
        <ProfileButton />
        <LoginButton />
        <ThemeToggleButton toggleTheme={toggleTheme} />
        <HomeButton />
      </div>
    </nav>
  );
};

export default NavBar;
