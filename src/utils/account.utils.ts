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
 * @param {string} endpoint 
 * @returns {number} response code 
 */
export const sendUserData = async (user: User, endpoint: string): Promise<number> => {
    const URL: string = `URL_FOR_API/${endpoint}`;
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        return response.status as number

    } catch (error: any) {
        console.log(error.message);
        return 500;
    }
};

//TODO: impelement the fetchUser data

/**
 * when the user logsout something on their account this function should be called first. 
 * If it is successuful, the function will automatically remove the user from localStorage which
 * is how variables are stored persitently. Caller of this function must reload the page however 
 * after use
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
 * const oncClick = async (endpoint: string) => {
 *  if (await logout(endpoint) !== 200) { console.log("Saving unsucesfull"); return; }
 *  
 *  //RELOAD PAGE
 * }
 * 
 *
 * 
 * @param {string} endpoint Chose LOGOUT to logout or DELETE
 * @returns {number} response code 
 */
export const logout = async (endpoint: string): Promise<number> => {
    const URL: string = `URL_FOR_API/${endpoint}`;
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        });

        localStorage.removeItem("user");

        return response.status as number

    } catch (error: any) {
        console.log(error.message);
        return 500;
    }
};