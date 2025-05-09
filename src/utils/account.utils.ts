// src/utils/account.utils.ts
import { User } from "./types"; // Ensure this path is correct for your User type

/**
 * when the user saves something on their account this function should be called first.
 * If it is successful, then the data should also be saved locally using `setUser` from
 * UserContext hook
 */
export const sendUserData = async (user: User, endpoint: string): Promise<number> => {
    try {
        const params = new URLSearchParams({
            email: user.email,
            displayName: user.displayName,
            password: user.password, // Consider security implications of sending password this way
            avatar: user.avatar || '', // Ensure avatar is a string, even if null/undefined
        });
        const response = await fetch(`/${endpoint}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });
        return response.status;
    } catch (error: any) {
        console.error("Error in sendUserData:", error.message);
        return 500;
    }
};

/**
 * After successfully login in, this function needs to be called.
 * Fetches user data based on email or other identifier.
 */
export const fetchUserData = async (identifier: string, endpoint: string): Promise<User | null> => {
    try {
        // Assuming the identifier is an email for now, adjust if it's a user ID
        // Also, the backend might expect this in the URL (e.g., /users/email/{identifier})
        // or as a query param (e.g., /users?email={identifier}) for a GET request.
        // If it's a POST, the body might be JSON or form-urlencoded.
        // This example uses POST with form-urlencoded for consistency with sendUserData.
        const params = new URLSearchParams();
        params.append("email", identifier); // Or "id" if identifier is an ID

        const response = await fetch(`/${endpoint}`, { // Adjust endpoint as needed (e.g., /users/fetch)
            method: "POST", // Or "GET" if appropriate for your API (e.g., `/${endpoint}/${identifier}`)
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params
        });

        if (!response.ok) {
            console.error(`Error fetching user data: ${response.status} ${response.statusText}`);
            return null;
        }
        return response.json() as Promise<User>;
    } catch (error: any) {
        console.error("Error in fetchUserData:", error.message);
        return null;
    }
};

/**
 * Sends a request to the backend to delete the user's account.
 */
export const deleteUser = async (userId: number, endpoint: string): Promise<number> => {
    try {
        // Construct the full API path. Example: /api/users/123
        // **IMPORTANT**: Confirm this path structure with your backend requirements.
        const response = await fetch(`/${endpoint}/${userId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json', // Often optional for DELETE
                // Add Authorization header if needed: 'Authorization': `Bearer ${yourAuthToken}`,
            },
        });
        return response.status;
    } catch (error: any) {
        console.error("Error in deleteUser:", error.message);
        return 500;
    }
};

/**
 * Removes user data from localStorage and clears session cookies.
 */
export const logout = () => {
    localStorage.removeItem("user"); // Assuming "user" is the key for user data in localStorage
    // Clear session-specific cookies. This is a generic example.
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Add any other cookies your app uses that should be cleared on logout.
    console.log("User data and cookies cleared from client-side.");
};