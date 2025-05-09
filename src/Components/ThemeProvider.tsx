import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import React from "react";
import { ReactNode } from "react";


const customTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#0a0a0a", // pitch black background
      paper: "#121a2f",   // dark blue-ish paper
    },
    primary: {
      main: "#2196f3", // vibrant blue that pops
      light: "#64b5f6", // lighter blue for hover states
    },
    secondary: {
      main: "#f50057", // vibrant pink for accents
    },
    text: {
      primary: "#ffffff", // white text
      secondary: "#b0bec5", // soft white-gray
    },
    action: {
      active: "#90caf9", // bright blue for active elements
      hover: "rgba(144, 202, 249, 0.08)", // subtle hover effect
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.01562em",
      textShadow: "0 0 10px rgba(33, 150, 243, 0.3)"
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.00833em",
      textShadow: "0 0 8px rgba(33, 150, 243, 0.3)"
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "0em",
      textShadow: "0 0 6px rgba(33, 150, 243, 0.3)"
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "0.00735em",
      textShadow: "0 0 4px rgba(33, 150, 243, 0.3)"
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "0.0075em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          scrollbar-width: thin;
          scrollbar-color: #1976d2 #121a2f;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #121a2f;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #1976d2;
          border-radius: 4px;
        }
      `,
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(144, 202, 249, 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "#90caf9",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196f3",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#90caf9",
          },
          "& .MuiInputBase-input": {
            color: "white",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 10px rgba(0, 0, 0, 0.4)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #c62828 30%, #d32f2f 90%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          background: "linear-gradient(145deg, #121a2f 0%, #0c1423 100%)",
          border: "1px solid rgba(144, 202, 249, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #090c14 0%, #121a2f 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(33, 150, 243, 0.08)",
          },
        },
      },
    },
  },
});


export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MuiThemeProvider theme={customTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export { MuiThemeProvider as ThemeProvider };