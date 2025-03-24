import { User } from "../hooks/UserContext";

/**
 * when the user saves something on their account this function should be called first. 
 * If it is successuful, then the data should also be saved locally using `setUser` from 
 * UserContext hook
 * 
 * 200 - OK
 * 
 * 400 - invallid request
 * 
 * 401 - unauthorised
 * 
 * 405 - method not allowed
 * 
 * 500 - backend issues (exact error in the body of the response)
 * 
 * @example 
 * 
 * const oncClick = async (user) => {
 *  const updatedUser = { ...user, displayName: "New Name" };
 *  if (await sendUserData(updatedUser, "ENDPOINT") !== 200) { console.log("Saving unsucesfull"); return; }
 *  
 *  setUser(updatedUser);
 * }
 * 
 * @param {User} user 
 * @param {string} endpoint  user 
 * @returns {number} response code 
 */
export const sendUserData = async (user: User, endpoint: string): Promise<number> => {
    const URL: string = `${process.env.REACT_APP_BACK_END_URL}/${endpoint}`;
    try {
        const response = await fetch(URL, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        return response.status as number

    } catch (error: any) {
        console.log(error.message);
        return 500;
    }
};

/**
 * After succesfully loging in, this function needs to be called. It creates a new instance of User
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
 * @param endpoint TODO: endpoint
 * @returns User or null
 */
export const fetchUserData = async (endpoint: string): Promise<User | null> => {
    const URL: string = `${process.env.REACT_APP_BACK_END_URL}/${endpoint}`;
    try {
        const response = await fetch(URL, {
            method: "POST",
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
export const logout = async (endpoint: string): Promise<number> => {
    const URL: string = `${process.env.REACT_APP_BACK_END_URL}/${endpoint}`;

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            return 500;
        }

        localStorage.removeItem("user");

        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Redirect to login page
        return response.status as number

    } catch (error: any) {
        console.log(error.message);
        return 500;
    }
  
export const logout = () => {
    localStorage.removeItem("user");
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};