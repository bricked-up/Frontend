import { API_BASE } from "../config";

/**
 * Used to register, login, or reset password via URL-encoded form data.
 *
 * Sends a POST request with 'application/x-www-form-urlencoded' body.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} endPoint 'signup' | 'verify' | 'login'
 * @returns {Promise<number>}
 */
export const authUser = async (
    email: string,
    password: string,
    endPoint: string
  ): Promise<number> => {
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
        return response.status;
      }
  
      const sessionData = await response.json();
      const sessionId = sessionData.id;
      const expires = sessionData.expires;
  
      console.log("settingcookie manually");
      document.cookie = `bricked-up_login=${sessionId}; expires=${new Date(
        expires
      ).toUTCString()}; path=/; SameSite=Lax`;
  
      console.log("Cookie manually set:", document.cookie);
  
      // Redirect on success
      window.location.href = "/";
      return 200;
    } catch (error: any) {
      console.error("Network error:", error.message);
      return -1;
    }
  };
  