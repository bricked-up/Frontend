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
        const params = new URLSearchParams();
        params.append("email", email);
        if (endPoint !== "verify") {
            params.append("password", password);
        }

        const response = await fetch(`/${endPoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

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