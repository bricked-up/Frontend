import { User, Issue } from "./types";

/**
 * After successfully login in, this function needs to be called. It creates a new instance of User
 * note that this does not save it to the localstorage and the `setUser` function still needs to 
 * be called. 
 * 
 * if the response is null, there was an internal server error
 * 
 * @example
 * 
 * const [issue, setIssue] = useState<Issue>();
 * 
 * useEffect(() => {
 *  const getData = async () => {
 *    const newIssue: Issue | null = await getUserData("324ui32iui4i23");
 * 
 *    if (newIssue === null) {
 *          navigate("/500");
 *    }
 * 
 *    setUsers(newIssue);
 *  };
 *  getData();
 * }, []);
 * 
 * @param endpoint
 * @returns User or null
 */
export const getUser = async (id: string): Promise<Issue | null> => {
    try {
        const params = new URLSearchParams({
            id
        });

        const response = await fetch(`/get-user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params
        });

        if (!response.ok) { return null }

        const data: Issue | null = await response.json();

        return data;

    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}

/**
 * After successfully login in, this function needs to be called. It creates a new instance of User
 * note that this does not save it to the localstorage and the `setUser` function still needs to 
 * be called. 
 * 
 * if the response is null, there was an internal server error
 * 
 * @example
 * 
 * const [user, setUser] = useState<User>();
 * 
 * useEffect(() => {
 *  const getData = async () => {
 *    const users: User | null = await getUserData("meow@kitty.com");
 * 
 *    if (user === null) {
 *          navigate("/500");
 *    }
 * 
 *    setUsers(users);
 *  };
 *  getData();
 * }, []);
 * 
 * @param endpoint
 * @returns User or null
 */
export const getIssue = async (email: string): Promise<User | null> => {
    try {
        const params = new URLSearchParams({
            email
        });

        const response = await fetch(`/get-user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params
        });

        if (!response.ok) { return null }

        const data: User | null = await response.json();

        return data;

    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}

/** 
 * if null the request was not successful. This function should be used in 
 * a useEffect() block. 
 * 
 * When calling this function you pass the project name and if the 
 * request succeeds it will return an array of all the member's names (in this case emails)
 * 
 * @example 
 * 
 * const [user, setUser] = useState<string[]>();
 * 
 * useEffect(() => {
 *  const getData = async () => {
 *    const users: string[] | null = await getProjectMember("brickedUp");
 * 
 *    if (user === null) {
 *          navigate("/500");
 *    }
 * 
 *    setUsers(users);
 *  };
 *  getData();
 * }, []);
 * 
 * @param {string} project 
 * @returns {Promise<string[] | null>}
 */
export const getProjectMember = async (project: string): Promise<string[] | null> => {
    try {
        const param = new URLSearchParams({
            project
        });

        const response = await fetch(`/proj-members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: param
        });

        if (!response.ok) { return null }

        const data: string[] | null = await response.json();

        return data;

    } catch (error: any) {
        console.log(error.message);
        return null;
    }
};