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
 * const [User, setUser] = useState<User>();
 * 
 * useEffect(() => {
 *  const getData = async () => {
 *    const newUser: User | null = await getUserData("324ui32iui4i23");
 * 
 *    if (newUser === null) {
 *          navigate("/500");
 *    }
 * 
 *    setUsers(newUser);
 *  };
 *  getData();
 * }, []);
 * 
 * @param endpoint
 * @returns User or null
 */
export const getUser = async (email: string): Promise<User | null> => {
    try {
        const params = new URLSearchParams({
            email
        });

        const response = await fetch(`/get-user?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
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
 * After successfully login in, this function needs to be called. It creates a new instance of User
 * note that this does not save it to the localstorage and the `setUser` function still needs to 
 * be called. 
 * 
 * if the response is null, there was an internal server error
 * 
 * @example
 * 
 * const [issues, setIssues] = useState<Issue>();
 * 
 * useEffect(() => {
 *  const getData = async () => {
 *    const newIssues: Issue | null = await getUserData("meow@kitty.com");
 * 
 *    if (newIssues === null) {
 *          navigate("/500");
 *    }
 * 
 *    setIssues(newIssues);
 *  };
 *  getData();
 * }, []);
 * 
 * @param endpoint
 * @returns Issue or null
 */
export const getUserIssues = async (userId: number): Promise<Issue | null> => {
    try {
        const params = new URLSearchParams({
            userId: String(userId)
        });

        const response = await fetch(`/get-user?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
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
export const getProjectMembers = async (project: string): Promise<string[] | null> => {
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

// TODO: export const getProjectIssues = async (projectId: string): Promise<Issue | null> => { }
// TODO: export const getOrgIssues = async (orgId: string): Promise<Issue | null> => { }
// TODO: export const getProjectIssues = async (projectId: string): Promise<Issue | null> => { }