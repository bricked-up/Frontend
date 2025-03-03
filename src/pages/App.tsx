import React, { useContext } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import { useTheme } from '@mui/material/styles';
import ThemeToggleButton from '../Components/ThemeToggleButton';
import NavBar from '../Components/NavBar';
import { ThemeContext } from '../Components/ThemeProvider'; // Adjust the path as needed

function App() {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p
          style={{
            color: theme.palette.text.primary,
            fontSize: '1rem',
            margin: theme.spacing(2),
          }}
        >
          This paragraph is styled using the current MUI theme.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ThemeToggleButton toggleTheme={toggleTheme} />
      </header>
    </div>
  );
}

export default App;
