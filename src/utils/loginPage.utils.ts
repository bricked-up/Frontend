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
    const params = new URLSearchParams({ email });

    if (endPoint !== "verify") {
      params.append("password", password);
    }

    console.log(params);
    console.log(`Sending request to ${API_BASE}/${endPoint}`);
    console.log("Params:", params.toString());

    const response = await fetch(`${API_BASE}/${endPoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      credentials: "include",
    });

    console.log("Response status:", response.status);


    if (response.ok && response.status === 200) {
      window.location.href = "/";
      return 200;
    }

    return 500;
  } catch (error: any) {
    console.error("Network error:", error.message);
    return -1;
  }
};

export default authUser;
