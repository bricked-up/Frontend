import React from "react";
import { useTheme } from "@mui/material/styles";
import NavBar from "../Components/Navbar/NavBar";
import "../css/LandingPage.css";
import stickyNoteIcon from "../assets/sticky_note_icon.png";
import calendarIcon from "../assets/calendar_icon.png";
import emailIcon from "../assets/email_icon.png";

/**
 * The Landing Page for Bricked Up
 *
 * Renders the main landing page with a brief introduction and icons representing features.
 * The background color is dynamically set using the current theme's palette.
 *
 * @component
 * @returns {JSX.Element}
 *
 * @example
 * return(
 *   <LandingPage />
 * )
 */
const LandingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Top Navbar */}
      <NavBar />

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* The Themed Square */}
        <div
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.primary,
            padding: "40px",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "600px",
            width: "80%",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>
            Collaborate, plan and track <br /> all in one place
          </h1>

          {/* Icon Section */}
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
              gap: "60px",
            }}
          >
            <img src={stickyNoteIcon} alt="Sticky Note Icon" style={{ width: "90px", height: "90px" }} />
            <img src={calendarIcon} alt="Calendar Icon" style={{ width: "90px", height: "90px" }} />
            <img src={emailIcon} alt="Email Icon" style={{ width: "180px", height: "90px" }} />
          </div>
        </div>
      </main>

      {/* Footer pinned to bottom */}
      <footer
        style={{
          marginTop: "auto",
          textAlign: "center",
          padding: "20px",
          opacity: 0.9,
        }}
      >
        © 2025 Bricked Up, Inc.
      </footer>
    </div>
  );
};

export default LandingPage;
