import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    contrast: {
      main: string;
    };
    neutral: {
      main: string;
      dark: string; 
      light: string; 
    };
  }
  interface PaletteOptions {
    contrast?: {
      main?: string;
    };
    neutral?: {
      main?: string;
      dark?: string;  
      light?: string; 
    };
  }
}
