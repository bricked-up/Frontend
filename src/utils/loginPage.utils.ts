/**
 * used to register, login or reset password. This function sends a fetch requestion by HTTP
 * and waits for the responde code.
 * 
 * 200 - OK
 * 400 - or invallid request
 * 401 - unauthorised
 * 405 - method not allowed
 * 500 - backend issues (exact error in the body of the response)
 * 
 * the function will return the status code and -1 if the connection could not have been made
 * 
 * @param   {string} email 
 * @param   {string} password 
 * @param   {string} endPoint should be signup | verify | login
 * @returns {Promise<number>}
 * @throws  {any} 
 */
export const authUser = async (email: string, password: string, endPoint: string): Promise<number> => {
    const url: string = `${process.env.REACT_APP_BACK_END_URL}/${endPoint}`;

    try {
        const requestBody = endPoint == "verify"
            ? { email }
            : { email, password };

        const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error("Could not even connect to the server");
        }

        return response.status as number;

    } catch (error: any) { // could not even make the fetch response
        console.log(error.message);
        return Promise.resolve(-1);
    }
}

export default authUser;
