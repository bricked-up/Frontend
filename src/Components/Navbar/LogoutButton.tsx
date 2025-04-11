import { logout } from '../../utils/account.utils'; // Adjust path based on your directory structure
import "../../css/LoginButton.css";

/**
 * A button that, when clicked, logs out the user and redirects them
 * to the home page. Uses window.location.href for navigation rather
 * than react-router's navigate.
 *
 * @component
 * @example
 * return (
 *   <LogoutButton />
 * );
 *
 * @returns {JSX.Element} The rendered logout button.
 */
const LogoutButton = () => {

  const handleLogout = (): void => {
    logout();
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
