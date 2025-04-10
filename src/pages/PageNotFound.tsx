import React from "react";
import GhostMouse from "../Components/GhostMouse";
import { useTheme } from "@mui/material/styles";
import Layout from "../Components/Layout";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";

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
const Page404Content: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      className="box"
      sx={{
        backgroundColor: theme.palette.primary.main,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 104px)", // Account for topbar and padding
        width: "100%",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <GhostMouse />
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
      <div className="box__description">
        <div
          className="box__description-container"
          style={{ color: theme.palette.text.primary }}
        >
          <div className="box__description-title">Whoops!</div>
          <div
            className="box__description-text"
            style={{ color: theme.palette.text.primary }}
          >
            It seems like we couldn't find the page you were looking for
          </div>
        </div>
        <a
          href="/"
          className="box__button"
          style={{ color: theme.palette.text.primary }}
        >
          Go back
        </a>
      </div>
    </Box>
  );
};

const Page404: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<Page404Content />} />
      </Route>
    </Routes>
  );
};

export default Page404;