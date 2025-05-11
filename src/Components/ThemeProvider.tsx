// src/components/ThemeProvider.tsx
import React, { ReactNode, useMemo, useState, createContext, useContext, useEffect } from 'react';
import { 
  createTheme, 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline, 
  PaletteMode 
} from '@mui/material';

// Create a context for theme mode
interface ColorModeContextProps {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

const ColorModeContext = createContext<ColorModeContextProps>({
  toggleColorMode: () => {},
  mode: 'dark', // Default mode
});

// Hook to use the color mode context
export const useColorMode = () => useContext(ColorModeContext);

// Define theme options based on mode
const getDesignTokens = (mode: PaletteMode) => ({
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
            main: '#f50057', // Pink accent
            light: '#ff4081',
            dark: '#c51162',
          },
          background: {
            default: '#f5f5f5', // Light grey background
            paper: '#ffffff',   // White paper
          },
          text: {
            primary: '#212121',
            secondary: '#757575',
          },
          action: {
            active: '#1976d2',
            hover: 'rgba(25, 118, 210, 0.08)',
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
            main: '#f50057', // Vibrant pink for accents
            light: '#ff4081',
            dark: '#c51162',
          },
          background: {
            default: '#0a0a0a', // Near black background
            paper: '#121a2f',   // Dark blue paper
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
          },
          action: {
            active: '#90caf9', // Bright blue for active elements
            hover: 'rgba(144, 202, 249, 0.08)', // Subtle hover effect
          },
        }),
  },
  shape: {
    borderRadius: 8, // Global border radius
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01562em',
      ...(mode === 'dark' && { textShadow: '0 0 10px rgba(33, 150, 243, 0.3)' }),
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.00833em',
      ...(mode === 'dark' && { textShadow: '0 0 8px rgba(33, 150, 243, 0.3)' }),
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '0em',
      ...(mode === 'dark' && { textShadow: '0 0 6px rgba(33, 150, 243, 0.3)' }),
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.00735em',
      ...(mode === 'dark' && { textShadow: '0 0 4px rgba(33, 150, 243, 0.3)' }),
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '0.0075em',
    },
    button: {
      textTransform: 'none' as 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          scrollbar-width: thin;
          scrollbar-color: ${mode === 'dark' ? '#1976d2 #121a2f' : '#1976d2 #f5f5f5'};
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${mode === 'dark' ? '#121a2f' : '#f5f5f5'};
        }
        ::-webkit-scrollbar-thumb {
          background-color:rgb(22, 40, 57);
          border-radius: 4px;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Reduced border radius to fix oval appearance
          padding: '8px 16px', // More balanced padding
          fontWeight: 600,
          boxShadow: mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'dark' 
              ? '0 6px 10px rgba(0, 0, 0, 0.4)' 
              : '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          color: 'white',
          background: mode === 'dark'
            ? 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)'
            : '#1976d2',
          '&:hover': {
            background: mode === 'dark'
              ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
              : '#1565c0',
          },
        },
        containedSecondary: {
          color: 'white',
          background: mode === 'dark'
            ? 'linear-gradient(45deg, #c51162 30%, #f50057 90%)'
            : '#f50057',
          '&:hover': {
            background: mode === 'dark'
              ? 'linear-gradient(45deg, #b0003a 30%, #c51162 90%)'
              : '#c51162',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: '16px',
          marginBottom: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' 
                ? 'rgba(144, 202, 249, 0.5)' 
                : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2196f3',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'dark' 
            ? '0 8px 16px rgba(0, 0, 0, 0.5)' 
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
          ...(mode === 'dark' && {
            backdropFilter: 'blur(4px)',
            background: 'linear-gradient(145deg, #121a2f 0%, #0c1423 100%)',
            border: '1px solid rgba(144, 202, 249, 0.1)',
          }),
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark'
            ? 'linear-gradient(90deg, #090c14 0%, #121a2f 100%)'
            : '#1976d2',
          boxShadow: mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.5)'
            : '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: mode === 'dark'
              ? 'rgba(33, 150, 243, 0.08)'
              : 'rgba(25, 118, 210, 0.08)',
          },
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
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: PaletteMode;
}

// Main ThemeProvider component
const ThemeProvider = ({ children, defaultMode = 'dark' }: ThemeProviderProps) => {
  // Try to get the theme mode from localStorage
  const getInitialMode = (): PaletteMode => {
    if (typeof window === 'undefined') return defaultMode;
    
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (savedMode) return savedMode;
    
    // Check system preference if no saved mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? 'dark' : 'light';
  };
    
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  // Toggle color mode function
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('themeMode', newMode);
          }
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  // Generate the theme based on current mode
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // Effect to listen for system preference changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Check if user has a saved preference
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) return; // Don't override user preference
    
    // Listen for system preference changes if no user preference is set
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    
    // Modern browsers
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Fallback for older browsers
    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;