import React from "react";
import GhostMouse from "../Components/GhostMouse";
import NavBar from "../Components/Navbar/NavBar";
import { useTheme } from "@mui/material/styles";

/**
 * This component displays the 404 error message when the user navigates to a non-existing page.
 *
 * It handles undefined routes and provides a link (through a button) for the user to return
 * to the landing page.
 *
 * @component
 * @example
 * return (
 *   <Page404 />
 * )
 */
const Page404: React.FC = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* <NavBar /> */}

      <div className="box__ghost">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="symbol"></div>
        ))}

        <div className="box__ghost-container">
          <div className="box__ghost-eyes">
            <div
              className="box__eye-left"
              style={{ backgroundColor: theme.palette.primary.main }}
            ></div>
            <div
              className="box__eye-right"
              style={{ backgroundColor: theme.palette.primary.main }}
            ></div>
          </div>
          <div className="box__ghost-bottom">
            {[...Array(5)].map((_, index) => (
              <div key={index}></div>
            ))}
          </div>
        </div>
        <div className="box__ghost-shadow"></div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
          color: theme.palette.text.primary,
        }}
      >
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>Whoops!</div>
        <div style={{ marginTop: "0.5rem" }}>
          It seems like we couldn't find the page you were looking for.
        </div>
        <a
          href="/"
          style={{
            marginTop: "1.5rem",
            display: "inline-block",
            textDecoration: "none",
            padding: "0.75rem 1.5rem",
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Go back
        </a>
      </div>
    </div>
  );
};

export default Page404;