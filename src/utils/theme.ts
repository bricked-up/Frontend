import { createTheme } from "@mui/material";

// light mode 
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#F6F6DF",
        },
        primary: {
            main: "#6AA0A0",
        },
        secondary: {
            main: "#8752A3",
        },
        text: {
            primary: "#020202",
        },
    },
});

// TODO: chose dark mode and assign proper collors
export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "A9A9A9"
        },
        text: {
            primary: "#F0EAD6", // eggshell hex color
        },
    },
}); 