import { User } from "./types";

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
 *  const updatedUser = { ...user, displayName: "New Name" };
 *  if (await sendUserData(updatedUser, "ENDPOINT") !== 200) { console.log("Saving unsuccessful"); return; }
 *  
 *  setUser(updatedUser);
 * }
 * 
 * @param {User} user 
 * @param {string} endpoint  user 
 * @returns {number} response code 
 */
export const sendUserData = async (user: User, endpoint: string): Promise<number> => {
    // TODO: send the image separately 
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

        return response.status as number

    } catch (error: any) {
        console.log(error.message);
        return 500;
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
 * const userResponse = fetchUserData("update");
 * if (userResponse) {
 *      setUser{...user, userResponse};
 * } else {
 *      // ERROR MESSAGE
 * }
 * 
 * @param endpoint
 * @returns User or null
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

        if (!response.ok) { return null }

        return response.json() as Promise<User>;

    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}

/**
 *  just click this and it will remove user data from localstorage and remove cookies
 */
export const logout = () => {
    localStorage.removeItem("user");
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};