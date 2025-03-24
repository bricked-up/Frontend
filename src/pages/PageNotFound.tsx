import React from "react";
import GhostMouse from "../Components/GhostMouse";
import NavBar from "../Components/NavBar";
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
        backgroundColor: theme.palette.background.default, // Page background color from theme
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <NavBar />
      <div>
        <GhostMouse />

        <div className="box" style={{ backgroundColor: theme.palette.contrast.main }}>
          {/* For ghost elements, we now use the page's background default color */}
          <div className="box__ghost">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="symbol"
                style={{ backgroundColor: theme.palette.background.default }}
              ></div>
            ))}

            <div className="box__ghost-container" style={{ backgroundColor: theme.palette.background.default }}>
              <div className="box__ghost-eyes">
                <div
                  className="box__eye-left"
                  style={{ backgroundColor: theme.palette.contrast.main }}
                ></div>
                <div
                  className="box__eye-right"
                  style={{ backgroundColor: theme.palette.contrast.main }}
                ></div>
              </div>
              <div className="box__ghost-bottom">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: theme.palette.background.default }}
                  ></div>
                ))}
              </div>
            </div>
            <div
              className="box__ghost-shadow"
            ></div>
          </div>

          <div className="box__description">
            <div
              className="box__description-container"
              style={{ color: theme.palette.text.primary }}
            >
              <div className="box__description-title">Whoops!</div>
              <div className="box__description-text">
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
        </div>
      </div>
    </div>
  );
};

export default Page404;
