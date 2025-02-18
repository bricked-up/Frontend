// src/ThemeToggleButton.tsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { Button } from '@mui/material';

const ThemeToggleButton: React.FC = () => {
    const { toggleTheme, mode } = useContext(ThemeContext);

    return (
        <Button variant="contained" onClick={toggleTheme}>
            Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
    );
};

export default ThemeToggleButton;