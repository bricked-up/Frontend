import { User, Issue } from "./types";

/**
 * Fetches user data based on their User ID.
 * Aligned with backend GET /get-user endpoint which expects 'userid'.
 * * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<User | null>} User object or null if not found or error.
 */
export const getUser = async (userId: number): Promise<User | null> => {
    try {
        // Backend expects 'userid' (lowercase) as a URL query parameter
        const params = new URLSearchParams({
            userid: String(userId) 
        });

        // Use GET method and append params to URL
        const response = await fetch(`/get-user?${params.toString()}`, {
            method: "GET",
            // No body needed for GET, Content-Type header is not relevant here
        });

        if (!response.ok) { 
            console.error(`Error fetching user ${userId}: ${response.status}`);
            return null; 
        }

        // Assuming the backend returns JSON compatible with the User type
        const data: User | null = await response.json(); 
        return data;

    } catch (error: any) {
        console.error("Error in getUser:", error.message);
        return null;
    }
}

/**
 * Fetches a specific issue based on its ID.
 * Aligned with backend GET /get-issue endpoint.
 * * @param {number} issueId - The ID of the issue to fetch.
 * @returns {Promise<Issue | null>} Issue object or null if not found or error.
 */
export const getIssue = async (issueId: number): Promise<Issue | null> => {
    try {
        // Backend /get-issue expects 'issueid' (lowercase) as a URL query parameter
        const params = new URLSearchParams({
            issueid: String(issueId)
        });

        // Use GET method and append params to URL
        const response = await fetch(`/get-issue?${params.toString()}`, {
            method: "GET",
        });

        if (!response.ok) { 
            console.error(`Error fetching issue ${issueId}: ${response.status}`);
            return null; 
        }

        // Assuming backend returns JSON compatible with Issue type
        const data: Issue | null = await response.json(); 
        return data;

    } catch (error: any) {
        console.error("Error in getIssue:", error.message);
        return null;
    }
}


/**
 * NOTE: This function targets the endpoint `/get-user` which returns user data, 
 * not issue data. The function name `getUserIssues` is misleading.
 * This function is kept for reference but likely needs replacement or significant
 * backend changes to fetch issues related to a user.
 * * It has been slightly corrected to use the 'userid' parameter case expected by the backend.
 * * @param {number} userId 
 * @returns {Promise<any | null>} Returns whatever /get-user returns, likely User data, NOT Issue data.
 */
export const getUserIssues_DEPRECATED_MISLEADING = async (userId: number): Promise<any | null> => {
    try {
        // Backend /get-user expects 'userid' (lowercase)
        const params = new URLSearchParams({
            userid: String(userId) 
        });

        // Use GET method for /get-user
        const response = await fetch(`/get-user?${params.toString()}`, {
            method: "GET",
        });

        if (!response.ok) { 
            console.error(`Error fetching data for user ${userId} via /get-user: ${response.status}`);
            return null; 
        }

        // Return the raw JSON data, as it's likely User data, not Issue data
        const data: any | null = await response.json(); 
        return data;

    } catch (error: any) {
        console.error("Error in getUserIssues_DEPRECATED_MISLEADING:", error.message);
        return null;
    }
}

/** * NOTE: This function targets `/proj-members`, which does not exist in the 
 * provided backend endpoints. It uses POST with a form body, 
 * which might be correct *if* the endpoint existed and used r.ParseForm().
 * * This function cannot be fully refactored without a valid backend endpoint.
 * Kept as is for reference.
 * * @param {string} project - Likely intended to be project ID or name.
 * @returns {Promise<string[] | null>} Array of member identifiers or null.
 */
export const getProjectMembers = async (project: string): Promise<string[] | null> => {
    try {
        // Assuming 'project' is the correct parameter name for the hypothetical endpoint
        const params = new URLSearchParams({
            project // Or perhaps 'projectid' if it expects an ID
        });

        // The original used POST with form body. This matches how most POSTs work in the backend.
        const response = await fetch(`/proj-members`, { // Endpoint doesn't exist in provided backend
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params 
        });

        if (!response.ok) { 
             console.error(`Error fetching project members for ${project}: ${response.status}`);
             return null; 
        }

        const data: string[] | null = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error in getProjectMembers:", error.message);
        return null;
    }
};


// --- TODO Implementations (based on typical patterns) ---

/**
 * Fetches issues for a specific project ID.
 * ASSUMPTION: Requires a backend endpoint like GET /get-project-issues?projectid=...
 * * @param {number} projectId - The ID of the project.
 * @returns {Promise<Issue[] | null>} Array of issues or null.
 */
export const getProjectIssues = async (projectId: number): Promise<Issue[] | null> => { 
    // This endpoint does not exist in the provided backend code.
    // This is a *hypothetical* implementation assuming a GET endpoint.
    const HYPOTHETICAL_ENDPOINT = '/get-project-issues'; 
    try {
        const params = new URLSearchParams({
            projectid: String(projectId)
        });

        const response = await fetch(`${HYPOTHETICAL_ENDPOINT}?${params.toString()}`, {
            method: 'GET',
        });

        if (!response.ok) { 
            console.error(`Error fetching issues for project ${projectId}: ${response.status}`);
            return null; 
        }

        const data: Issue[] | null = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error in getProjectIssues:", error.message);
        return null;
    }
}

/**
 * Fetches issues for a specific organization ID.
 * ASSUMPTION: Requires a backend endpoint like GET /get-org-issues?orgid=...
 * * @param {number} orgId - The ID of the organization.
 * @returns {Promise<Issue[] | null>} Array of issues or null.
 */
export const getOrgIssues = async (orgId: number): Promise<Issue[] | null> => { 
    // This endpoint does not exist in the provided backend code.
    // This is a *hypothetical* implementation assuming a GET endpoint.
     const HYPOTHETICAL_ENDPOINT = '/get-org-issues';
     try {
        const params = new URLSearchParams({
            orgid: String(orgId)
        });

        const response = await fetch(`${HYPOTHETICAL_ENDPOINT}?${params.toString()}`, {
            method: 'GET',
        });

         if (!response.ok) { 
            console.error(`Error fetching issues for organization ${orgId}: ${response.status}`);
            return null; 
        }

        const data: Issue[] | null = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error in getOrgIssues:", error.message);
        return null;
    }
}

// Removed duplicate TODO for getProjectIssues