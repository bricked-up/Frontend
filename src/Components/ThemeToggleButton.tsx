import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { Button } from '@mui/material';
import "../css/ThemeToggleButton.css";

const ThemeToggleButton: React.FC = () => {
    const { toggleTheme } = useContext(ThemeContext);

    return (
        <Button
            variant="contained"
            onClick={toggleTheme}
            className="theme-toggle-button"
        >
            Change Theme
        </Button>
    );
};

export default ThemeToggleButton;
