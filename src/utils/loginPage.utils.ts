// TODO: create an encryption password function
/**
 * use fetch to send data to the URL and wait for the response code which is a JSON
 * 200 - OK
 * 400 - or invallid request
 * 500 - backend issues (exact error in the body of the response)
 * 401 - unauthorised
 * 
 * @param   {string} username 
 * @param   {string} password 
 * @returns {Promise<any>}
 * @throws  {Error} 
 */
export const login = async (username: string, password: string): Promise<any> => {
    const url = "URL_PLEASE";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Could not even connect to the server");
        }

        const data = await response.json();

        return data.results[0];

    } catch (error: any) {
        console.log(error.message);
    }
}