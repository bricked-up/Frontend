import { API_BASE } from "../config";
import { Organization, Project, User } from "./types";


// --- Update Functions ---

/**
 * Updates the user. If the user's password field is empty the password field
 * will not be changed. If any other field is empty, the server will attempt 
 * to update that field to empty (if that is permitted).
 *
 * @param {number} sessionid - The session corresponding to the user.
 * @param {User} user - The user struct with values that will be updated.
 *                      The only values that will be used are user.name,
 *                      user.email, user.avatar, and user.password.
 * @returns {Promise<Error | null >} Promise resolving to null if user was successfully updated.
 *                            Otherwise an Error is returned.
 */
export const updateUser = async (sessionid: number, user: User): Promise<Error | null> => {
  try {
    const params = new URLSearchParams();
    params.append("sessionid", String(sessionid));
    params.append("name", user.name);
    params.append("email", user.email);
    params.append("avatar", String(user.avatar));
    params.append("password", String(user.password))

    const response = await fetch(`${API_BASE}/update-user`, {
      method: "PATCH",
      body: params
    });

    if (!response.ok) {
      let msg = await response.text();

      console.error(
        `Error updating user ${user.id}: Status ${response.status}, Message: ${msg}`);

      return new Error("Could not update user: " + msg);
    }

    return null

  } catch (error: any) {
    console.error(`Network or parsing error in getUser for ID ${user.id}:`, error.message);
    return error

  }
};

export const updateOrg = async (sessionid: number, org: Organization): Promise<Error | null> => {
  try {
    const params = new URLSearchParams({});
    params.append("sessionid", String(sessionid));
    params.append("orgid", String(org.id));
    params.append("name", org.name);

    const response = await fetch(`${API_BASE}/update-org`, {
      method: "PATCH",
      body: params
    });

    if (!response.ok) {
      let msg = await response.text();

      console.error(
        `Error updating user ${org.id}: Status ${response.status}, Message: ${msg}`);

      return new Error("Could not update user: " + msg);
    }

    return null

  } catch (error: any) {
    console.error(`Network or parsing error in getUser for ID ${org.id}:`, error.message);
    return error

  }
};