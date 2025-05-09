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
export const authUser = async (email: string, password: string, endPoint: string): Promise<number> => {
    try {
        const params = new URLSearchParams({
            "email": email,
        });

        params.append("email", email);
        if (endPoint !== "verify") {
            params.append("password", password);
        }
            
        window.alert(params.toString())

        const response = await fetch(`${API_BASE}/${endPoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
            credentials:"include"
        });

        window.alert(`meow meow ${response.status}`);

        if (!response.ok) {
            return 500;
        }

        
        return response.status;

    } catch (error: any) {
        console.error("Network error:", error.message);
        return -1;
    }
};

export default authUser;