import * as openpgp from 'openpgp';
import { PUBLIC_PGP, PRIVATE_PGP_KEY } from "./key"

/**
 * encrypts the password + username to so with public key
 * the encrypted will be only the password but I am using the username so that if 2 
 * users have the same password it would not overwrite itself in the db
 * 
 * @param   {string} username 
 * @param   {string} password 
 * @param   {string} publicKey 
 * @returns {Promise<string>}
 * @throws  {any}
 */
export const encryptPassword = async (username: string, password: string, armouredPublicKey: string): Promise<string> => {
    try {
        const key = await openpgp.readKey({ armoredKey: armouredPublicKey });

        const message = await openpgp.createMessage({ text: username + password });

        const encryptedMessage = await openpgp.encrypt({
            message,
            encryptionKeys: key
        });

        return encryptedMessage;

    } catch (error: any) {
        console.error('Encryption error:', error);
        throw new Error("Couldnot encrypt")
    }
}

// for debugging purposses only
export const decryptMessage = async (encryptedMessage: string, armouredPrivateKey: string): Promise<string> => {
    try {
        const privateKey = await openpgp.readPrivateKey({ armoredKey: armouredPrivateKey });

        const message = await openpgp.createMessage({ text: encryptedMessage });

        const { data: decryptedMessage } = await openpgp.decrypt({
            message,
            decryptionKeys: privateKey
        });

        return decryptedMessage;

    } catch (error: any) {
        console.error('Encryption error:', error);
        throw new Error("Couldnot encrypt")
    }
}


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
 * @throws  {any} 
 */
export const loginUser = async (username: string, password: string): Promise<any> => {
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

// TODO:
export const register: number = 2;