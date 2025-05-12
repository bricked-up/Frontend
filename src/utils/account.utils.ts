import { User } from "./types";
import { API_BASE } from "../config"; // Assuming API_BASE is your backend URL

/**
 * when the user saves something on their account this function should be called first.
 * If it is successful, then the data should also be saved locally using `setUser` from
 * UserContext hook
 *
 * 200 - OK
 *
 * 400 - invalid request
 *
 * 401 - unauthorized
 *
 * 405 - method not allowed
 *
 * 500 - backend issues (exact error in the body of the response)
 *
 * @example
 *
 * const oncClick = async (user) => {
 * const updatedUser = { ...user, displayName: "New Name" };
 * // Assuming 'update-user' is the correct endpoint from your PDF for PATCH
 * if (await sendUserData(updatedUser, "update-user") !== 200) { console.log("Saving unsuccessful"); return; }
 *
 * setUser(updatedUser);
 * }
 *
 * @param {User} user
 * @param {string} endpoint user (e.g., "update-user")
 * @returns {number} response code
 */
export const sendUserData = async (user: User, endpoint: string): Promise<number> => {
    // TODO: send the image separately (This often requires FormData instead of URLSearchParams)
    try {
        const params = new URLSearchParams({
            email: user.email,
            displayName: user.name,
            password: user.password ?? "",
            avatar: user.avatar ?? "",
        });
        const response = await fetch(`/${endpoint}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        return response.status as number;

    } catch (error: any) {
        console.error("Error in sendUserData:", error.message);
        return 500; // Or a more specific client-side error code like 0 or -1
    }
};

/**
 * After successfully login in, this function needs to be called. It creates a new instance of User
 * note that this does not save it to the localstorage and the `setUser` function still needs to
 * be called.
 *
 * if the response is null, there was an internal server error
 *
 * @example
 * // Assuming 'get-user-by-email' is a valid endpoint, or adjust as per your backend
 * // The PDF shows /get-user takes 'userid' via GET.
 * // If fetching by email, ensure the backend supports it via POST or a specific GET endpoint.
 * const userResponse = await fetchUserData("user@example.com", "get-user-by-email-endpoint");
 * if (userResponse) {
 * setUser({...user, ...userResponse}); // Spread userResponse into existing user or use directly
 * } else {
 * // ERROR MESSAGE
 * }
 *
 * @param email The email of the user to fetch.
 * @param endpoint The specific API endpoint (e.g., "get-user-by-email").
 * @returns User or null
 */
export const fetchUserData = async (email: string, endpoint: string): Promise<User | null> => {
    try {
        // This assumes your backend has an endpoint that accepts POST with email in the body.
        // More commonly, fetching a single resource like a user by an attribute is done via GET:
        // const response = await fetch(`${API_BASE}/${endpoint}?email=${encodeURIComponent(email)}`, {
        //     method: "GET",
        // });
        // Please verify with your backend documentation (uyt.pdf) for the correct method and parameters.
        // The provided PDF for /get-user specifies GET with 'userid'.
        // If this function is intended for a different purpose (e.g., post-login data retrieval where email is key),
        // ensure the endpoint and method match.

        const params = new URLSearchParams();
        params.append("email", email);

        const response = await fetch(`${API_BASE}/${endpoint}`, { // Prepend API_BASE
            method: "POST", // Or "GET" if the endpoint expects that for fetching by email
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", // Necessary for POST with URLSearchParams
            },
            body: params // Only for POST/PUT/PATCH
        });

        if (!response.ok) {
            console.error(`WorkspaceUserData failed for email ${email} on ${endpoint}: Status ${response.status} - ${await response.text()}`);
            return null;
        }
        if (response.status === 204) { // No content
            return null;
        }

        const userData = await response.json();
        return userData as User; // Add data transformation if needed (e.g., for dates)

    } catch (error: any) {
        console.error("Error in fetchUserData:", error.message);
        return null;
    }
};

/**
 * just click this and it will remove user data from localstorage and remove cookies
 */
export const logout = () => {
    localStorage.removeItem("user");
    // Robust cookie deletion
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Set path to / to ensure it covers cookies set on different paths
        // You might also need to specify 'domain' if cookies were set with a specific domain
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    }
    // If you know the exact name, path, and domain of your session cookie:
    // document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.yourdomain.com;';
    console.log("User logged out, localStorage and cookies cleared.");
};