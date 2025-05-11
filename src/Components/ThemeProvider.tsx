

import React, {
  ReactNode,
  useMemo,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  PaletteMode,
} from '@mui/material';

// Create a context for theme mode
interface ColorModeContextProps {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

const ColorModeContext = createContext<ColorModeContextProps>({
  toggleColorMode: () => {},
  mode: 'dark',
});

// Hook to use the color mode context
export const useColorMode = () => useContext(ColorModeContext);

// Theme tokens based on mode
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
          },
          secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
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
          primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#0d47a1',
          },
          secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
          },
          background: {
            default: '#0a0a0a',
            paper: '#121a2f',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
          },
          action: {
            active: '#90caf9',
            hover: 'rgba(144, 202, 249, 0.08)',
          },
        }),
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01562em',
      ...(mode === 'dark' && {
        textShadow: '0 0 10px rgba(33, 150, 243, 0.3)',
      }),
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.00833em',
      ...(mode === 'dark' && {
        textShadow: '0 0 8px rgba(33, 150, 243, 0.3)',
      }),
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '0em',
      ...(mode === 'dark' && {
        textShadow: '0 0 6px rgba(33, 150, 243, 0.3)',
      }),
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.00735em',
      ...(mode === 'dark' && {
        textShadow: '0 0 4px rgba(33, 150, 243, 0.3)',
      }),
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none' as const,
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
          background-color: rgb(22, 40, 57);
          border-radius: 4px;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          fontWeight: 600,
          boxShadow:
            mode === 'dark'
              ? '0 4px 6px rgba(0, 0, 0, 0.3)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
              mode === 'dark'
                ? '0 6px 10px rgba(0, 0, 0, 0.4)'
                : '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          color: 'white',
          background:
            mode === 'dark'
              ? 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)'
              : '#1976d2',
          '&:hover': {
            background:
              mode === 'dark'
                ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                : '#1565c0',
          },
        },
        containedSecondary: {
          color: 'white',
          background:
            mode === 'dark'
              ? 'linear-gradient(45deg, #c51162 30%, #f50057 90%)'
              : '#f50057',
          '&:hover': {
            background:
              mode === 'dark'
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
              borderColor:
                mode === 'dark'
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
          boxShadow:
            mode === 'dark'
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
          background:
            mode === 'dark'
              ? 'linear-gradient(90deg, #090c14 0%, #121a2f 100%)'
              : '#1976d2',
          boxShadow:
            mode === 'dark'
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor:
              mode === 'dark'
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

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: PaletteMode;
}

// Main ThemeProvider
const ThemeProvider = ({
  children,
  defaultMode = 'dark',
}: ThemeProviderProps) => {
  const getInitialMode = (): PaletteMode => {
    if (typeof window === 'undefined') return defaultMode;
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (savedMode) return savedMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

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
