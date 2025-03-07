import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import { CustomThemeProvider } from "./Components/ThemeProvider";
import { lightTheme } from "./utils/theme";
import { light } from "@mui/material/styles/createPalette";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
