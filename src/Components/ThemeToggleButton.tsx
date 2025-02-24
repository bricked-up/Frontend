// src/ThemeToggleButton.tsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

const ThemeToggleButton: React.FC = () => {
    const { toggleTheme, mode } = useContext(ThemeContext);
    const theme = useTheme();

    return (
        <Button variant="contained" onClick={toggleTheme}
            style={{ background: theme.palette.primary.main }}>
            Hello world
        </Button>
    );
};

export default ThemeToggleButton;