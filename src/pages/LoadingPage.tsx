import React from 'react';
import { Typography, useTheme } from '@mui/material';
import '../css/LoadingPage.css';
import NavBar from '../Components/Navbar/NavBar';

/**
 * this is used for when you are fetching data, this should be used while the data is being
 * fetched, otherwise the web page will crash
 * 
 * @example
 * 
 * const [dataIsLoaded, setDataIsLoaded] = useState(false);
 * 
 * if (! dataIsLoaded) return ( <LoadingPage /> )
 * 
 * // the original page
 * return (<></>);
 * 
 * @returns {JSX.element}
 */
const LoadingPage: React.FC = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", }}>
        <div
          aria-label="Orange and tan hamster running in a metal wheel"
          role="img"
          className="wheel-and-hamster"
        >
          <div className="wheel"></div>
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear"></div>
                <div className="hamster__eye"></div>
                <div className="hamster__nose"></div>
              </div>
              <div className="hamster__limb hamster__limb--fr"></div>
              <div className="hamster__limb hamster__limb--fl"></div>
              <div className="hamster__limb hamster__limb--br"></div>
              <div className="hamster__limb hamster__limb--bl"></div>
              <div className="hamster__tail"></div>
            </div>
          </div>
          <div className="spoke"></div>
        </div>
        <Typography
          variant="h4"
          fontWeight="bold"
          style={{ color: theme.palette.text.secondary, padding: "100px" }}>
          Loading<span className="dots"></span>
        </Typography>
      </main>
    </div >
  );
};

export default LoadingPage;









