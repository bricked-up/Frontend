// src/Components/Theme.tsx
import { createTheme, ThemeOptions, PaletteMode } from '@mui/material';

// Define the theme colors
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#1976d2', // Blue
            light: '#42a5f5',
            dark: '#1565c0',
          },
          secondary: {
            main: '#424242', // Darker grey
            light: '#757575',
            dark: '#212121',
          },
          background: {
            default: '#f5f5f5', // Light grey background
            paper: '#ffffff',   // White paper
          },
          text: {
            primary: '#212121',
            secondary: '#757575',
          },
        }
      : {
          // Dark mode
          primary: {
            main: '#2196f3', // Brighter blue for dark mode
            light: '#64b5f6',
            dark: '#0d47a1',
          },
          secondary: {
            main: '#757575', // Grey
            light: '#9e9e9e',
            dark: '#424242',
          },
          background: {
            default: '#121212', // Dark grey background
            paper: '#1e2845',   // Dark blue paper
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
          },
        }),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: '16px',
          marginBottom: '8px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
    },
  },
});

// Create the theme instances
export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));

// Create a default theme
const theme = createTheme({
  ...lightTheme,
  // You can override or add more configurations here
});

export default theme;