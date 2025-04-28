import { User } from "./types";

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
            password: user.password,
            avatar: user.avatar as string,
        });

        const response = await fetch(`/${endpoint}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        return response.status;
    } catch (error: any) {
        console.log(error.message);
        return 500;
    }
};

/**
 * After successfully login in, this function needs to be called.
 * If the response is null, there was an internal server error.
 */
export const fetchUserData = async (email: string, endpoint: string): Promise<User | null> => {
    try {
        const params = new URLSearchParams();
        params.append("email", email);

        const response = await fetch(`/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params
        });

        if (!response.ok) {
            return null;
        }

        return response.json() as Promise<User>;
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
};

/**
 * Just click this and it will remove user data from localstorage and remove cookies
 */
export const logout = () => {
    localStorage.removeItem("user");
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

/**
 * Deletes a user based on their ID.
 * Returns 200 on success, or appropriate error code.
 * 
 * @example
 * const status = await deleteUserData(userId);
 * if (status === 200) { console.log("User deleted successfully"); }
 */
export const deleteUserData = async (userId: string): Promise<number> => {
    try {
        const params = new URLSearchParams();
        params.append("userId", userId);

        const response = await fetch(`/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params
        });

        return response.status;
    } catch (error: any) {
        console.log(error.message);
        return 500;
    }
};
