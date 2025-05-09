import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider as CustomThemeProvider } from "./Components/ThemeProvider";
import { UserProvider } from "./hooks/UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);