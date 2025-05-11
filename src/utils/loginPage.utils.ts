import { Session } from "react-router-dom";
import { API_BASE } from "../config";

/**
 * Authenticates the user by sending their credentials to the backend
 * using URL-encoded form data.
 *
 * On successful login, the backend responds with a JSON object containing
 * session details (`sessionid`, `userid`, `expires`), which are stored in
 * `localStorage` by the frontend.
 *
 * The function also redirects the user to the homepage (`/`) if login succeeds.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} endPoint - The endpoint to hit (e.g., 'login', 'signup', 'verify').
 * @returns {Promise<number>} - The HTTP status code (200 on success, or error code).
 *
 * @example
 * const status = await authUser("user@example.com", "secret123", "login");
 * if (status === 200) {
 *   console.log("Login successful!");
 * }
 */

export const authUser = async (
    email: string,
    password: string,
    endPoint: string
  ): Promise<{ status: number;}> => {
    try {
      const params = new URLSearchParams({ email, password });
      const response = await fetch(
        `http://clabsql.clamv.constructor.university:3100/${endPoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        }
      );
  
      if (!response.ok) {
        console.error("Login failed with status:", response.status);
        return { status: response.status };
      }
  
      const text = await response.text();

      const sessionData = (text ? JSON.parse(text) : {})

      const expires = sessionData.expires;
      
      console.log(sessionData)
      console.log(sessionData.sessionid);
      console.log("settingcookie manually");

      localStorage.setItem("sessionid", sessionData.sessionid);
      localStorage.setItem("userid", sessionData.userid);

      return { status: 200};
    } catch (error: any) {
      console.error("Network error:", error.message);
      return { status: -1 };
    }
  };
  