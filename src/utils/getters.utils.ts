import { API_BASE } from "../config";
import {
    User,
    Issue,
    GetUserResult,
    GetIssueResult,
    GetProjectMembersResult,
    GetProjectIssuesResult,
    GetOrgIssuesResult,
    // Assuming SQLNullTime might be defined in types.ts eventually,
    // but for now, it's locally defined below or handled implicitly by RawIssueData.
} from "./types";

/**
 * @fileoverview Utility functions for fetching data from the backend API.
 * This module provides a set of asynchronous functions to retrieve various
 * data types like Users, Issues, Project Members, etc. It includes helper
 * functions for parsing API responses and transforming raw data into
 * structured TypeScript types, including date parsing for Issue objects.
 * All main getter functions return a Promise resolving to a GetResult<T> object,
 * which includes status, data (or null), and an optional error message.
 * Try-catch blocks for network/parsing errors within the main getters are
 * currently commented out, meaning promise rejections will propagate.
 */

// --- Helper Function for Parsing Errors ---

/**
 * Attempts to extract a human-readable error message from a fetch Response object.
 * It first tries to parse the response body as JSON and look for a 'message' property.
 * If JSON parsing fails or no 'message' property is found, it falls back to the
 * response body as plain text. If the body is empty, it uses `response.statusText`.
 *
 * @param {Response} response - The fetch Response object to parse for an error message.
 * @returns {Promise<string>} A promise that resolves to a string containing the error message.
 */
async function parseErrorResponse(response: Response): Promise<string> {
    const text = await response.text().catch(() => ""); // Catch if response.text() itself fails
    if (!text) return response.statusText;
    try {
        const json = JSON.parse(text);
        return typeof json.message === "string" ? json.message : text;
    } catch {
        // If JSON.parse fails, return the raw text
        return text;
    }
}

// --- Helper Types for Raw Backend Data ---

/**
 * @interface SQLNullTime
 * @description Represents the structure of a nullable time value often returned
 * by Go backends when using `sql.NullTime`.
 * @property {string} Time - The time value as a string (typically ISO 8601 format if Valid is true).
 * @property {boolean} Valid - A boolean indicating whether the Time value is valid (true) or represents a SQL NULL (false).
 */
interface SQLNullTime {
    Time: string;
    Valid: boolean;
}

/**
 * @interface RawIssueData
 * @description Defines the expected raw structure of an Issue object as it might be received
 * from the backend before any frontend parsing or transformation (e.g., date conversion).
 * This is an intermediate type used during the fetching process.
 * @property {number} id - The unique identifier of the issue.
 * @property {string} title - The title of the issue.
 * @property {string | null} [desc] - Optional description of the issue.
 * @property {number | null} [tagId] - Optional ID of the tag associated with the issue. Used if backend sends `tagId`.
 * @property {number | null} [tagid] - Optional ID of the tag. Fallback for potential backend inconsistency `tagid`.
 * @property {number | null} [priority] - Optional priority level of the issue.
 * @property {string} created - The creation timestamp as an ISO string.
 * @property {SQLNullTime | null} [completed] - Optional completion timestamp, structured as SQLNullTime.
 * @property {number} cost - The estimated or actual cost of the issue.
 * @property {any[]} [dependencies] - Optional array of dependencies. Should be typed more strictly if structure is known.
 * @property {any[]} [reminders] - Optional array of reminders. Should be typed more strictly if structure is known.
 */
interface RawIssueData {
    id: number;
    title: string;
    desc?: string | null;
    tagId?: number | null;
    tagid?: number | null;
    priority?: number | null;
    created: string;
    completed?: SQLNullTime | null;
    cost: number;
    dependencies?: any[];
    reminders?: any[];
}

// --- Helper Function to Parse Raw Issue Data ---

/**
 * Parses a raw issue data object received from the backend into a structured `Issue` type.
 * This includes converting date strings and SQLNullTime objects into JavaScript `Date` objects or `null`.
 * It also handles potential inconsistencies in `tagId`/`tagid` field names.
 *
 * @param {RawIssueData} raw - The raw issue data object from the backend.
 * @returns {Issue} The parsed issue object conforming to the `Issue` type.
 */
function parseRawIssueData(raw: RawIssueData): Issue {
    return {
        ...raw, // Spread other properties like id, title, desc, priority, cost
        tagId: raw.tagId ?? raw.tagid, // Prefer tagId, fallback to tagid, then undefined
        created: new Date(raw.created),
        completed: raw.completed && raw.completed.Valid ? new Date(raw.completed.Time) : null,
        // Ensure all properties of Issue are covered here or by the spread
    };
}

/**
 * Parses an array of raw issue data objects into an array of structured `Issue` types.
 *
 * @param {RawIssueData[]} rawIssues - An array of raw issue data objects from the backend.
 * @returns {Issue[]} An array of parsed issue objects.
 */
function parseRawIssueArray(rawIssues: RawIssueData[]): Issue[] {
    return rawIssues.map(parseRawIssueData);
}


// --- Revised Getter Functions ---

/**
 * Fetches user data based on their User ID.
 * Aligned with backend GET /get-user endpoint which expects 'userid' as a query parameter.
 * The function expects the backend to return user data that largely matches the `User` type directly,
 * without needing extensive parsing for fields other than potentially nested complex objects if they
 * were to involve dates (currently not assumed for User).
 *
 * Relevant Status Codes:
 * - 200 – OK: User data successfully retrieved.
 * - 401 – Unauthorized: Authentication required.
 * - 403 – Forbidden: Insufficient permissions.
 * - 404 – Not Found: User with the specified ID does not exist.
 * - 500 – Internal Server Error: Server encountered an error.
 *
 * @example
 * const { status, data: user, error } = await getUser(123);
 * if (user) {
 * console.log("Fetched user:", user.name);
 * } else {
 * console.error(`Error fetching user: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<GetUserResult>} A promise resolving to an object containing the HTTP status,
 * User data (or null if not found/error), and an optional error message.
 */
export const getUser = async (userId: number): Promise<GetUserResult> => {
    // try {
        const params = new URLSearchParams({
            userid: String(userId),
        });

        const response = await fetch(`${API_BASE}/get-user?${params.toString()}`, {
            method: "GET",
        });

        if (!response.ok) {
            const error = await parseErrorResponse(response);
            console.error(
                `Error fetching user ${userId}: Status ${response.status}, Message: ${error}`,
            );
            return { status: response.status, data: null, error };
        }

        const data: User = await response.json();
        return { status: response.status, data: data, error: undefined };
    // } catch (error: any) {
    //     console.error("Network or parsing error in getUser:", error.message);
    //     return {
    //         status: 0,
    //         data: null,
    //         error: error.message || "Network or parsing error",
    //     };
    // }
};

/**
 * Fetches a specific issue based on its ID.
 * Aligned with backend GET /get-issue endpoint which expects 'issueid' as a query parameter.
 * Parses the raw issue data, converting string dates and SQLNullTime structures into
 * JavaScript `Date` objects or `null`.
 *
 * Relevant Status Codes:
 * - 200 – OK: Issue data successfully retrieved and parsed.
 * - 401 – Unauthorized: Authentication required.
 * - 403 – Forbidden: Insufficient permissions.
 * - 404 – Not Found: Issue with the specified ID does not exist.
 * - 500 – Internal Server Error: Server encountered an error.
 *
 * @example
 * const { status, data: issue, error } = await getIssue(456);
 * if (issue) {
 * console.log("Fetched issue:", issue.title, "Created on:", issue.created);
 * } else {
 * console.error(`Error fetching issue: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} issueId - The ID of the issue to fetch.
 * @returns {Promise<GetIssueResult>} A promise resolving to an object containing the HTTP status,
 * parsed Issue data (or null), and an optional error message.
 */
export const getIssue = async (issueId: number): Promise<GetIssueResult> => {
    // try {
        const params = new URLSearchParams({
            issueid: String(issueId),
        });

        const response = await fetch(`${API_BASE}/get-issue?${params.toString()}`, {
            method: "GET",
        });

        if (!response.ok) {
            const error = await parseErrorResponse(response);
            console.error(
                `Error fetching issue ${issueId}: Status ${response.status}, Message: ${error}`,
            );
            return { status: response.status, data: null, error };
        }

        const rawData: RawIssueData = await response.json();
        const data: Issue = parseRawIssueData(rawData);
        return { status: response.status, data: data, error: undefined };
    // } catch (error: any) {
    //     console.error("Network or parsing error in getIssue:", error.message);
    //     return {
    //         status: 0,
    //         data: null,
    //         error: error.message || "Network or parsing error",
    //     };
    // }
};

/**
 * Fetches members for a specific project.
 * NOTE: This function targets a hypothetical `/proj-members` endpoint. Its current
 * implementation uses POST, which might need verification (GET could be more appropriate).
 * The correctness and behavior of this function depend entirely on the actual backend
 * endpoint definition, which is assumed to be non-existent or return 404 based on current tests.
 * The function currently expects the backend to return an array of strings (member identifiers).
 *
 * Relevant Status Codes (assuming a POST endpoint that might exist):
 * - 200 – OK or 201 Created: Members successfully retrieved.
 * - 400 – Bad Request: Invalid request format.
 * - 401 – Unauthorized: Authentication required.
 * - 403 – Forbidden: Insufficient permissions.
 * - 404 – Not Found: Project or endpoint does not exist.
 * - 405 – Method Not Allowed: If POST is not supported for the endpoint.
 * - 500 – Internal Server Error: Server encountered an error.
 *
 * @example
 * // Assuming project ID "proj-abc" and a working endpoint
 * const { status, data: members, error } = await getProjectMembers("proj-abc");
 * if (members) {
 * console.log("Project members:", members);
 * } else {
 * console.error(`Error fetching members: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {string} projectIdentifier - The identifier (ID or name) of the project.
 * Clarity on whether this should be a number or string
 * depends on the backend endpoint specification.
 * @returns {Promise<GetProjectMembersResult>} A promise resolving to an object containing the HTTP status,
 * an array of member identifiers (or null), and an optional error message.
 */
export const getProjectMembers = async (
    projectIdentifier: string,
): Promise<GetProjectMembersResult> => {
    const HYPOTHETICAL_ENDPOINT = "/proj-members";
    // try {
        const params = new URLSearchParams({
            project: projectIdentifier,
        });

        const response = await fetch(`${API_BASE}${HYPOTHETICAL_ENDPOINT}`, {
            method: "POST", // Verify: GET might be more appropriate for fetching data
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        if (!response.ok) {
            const error = await parseErrorResponse(response);
            console.error(
                `Error fetching project members for ${projectIdentifier}: Status ${response.status}, Message: ${error}`,
            );
            return { status: response.status, data: null, error };
        }

        const data: string[] = await response.json();
        return { status: response.status, data: data, error: undefined };
    // } catch (error: any) {
    //     console.error(
    //         "Network or parsing error in getProjectMembers:",
    //         error.message,
    //     );
    //     return {
    //         status: 0,
    //         data: null,
    //         error: error.message || "Network or parsing error",
    //     };
    // }
};

/**
 * Fetches issues for a specific project ID.
 * ASSUMPTION: Requires a backend endpoint like GET /get-project-issues?projectid=...
 * This implementation is hypothetical and depends on the actual backend endpoint definition.
 * It parses the raw issue data, converting dates for each issue in the returned array.
 *
 * Relevant Status Codes (assuming a GET endpoint):
 * - 200 – OK: Issues successfully retrieved and parsed.
 * - 401 – Unauthorized: Authentication required.
 * - 403 – Forbidden: Insufficient permissions.
 * - 404 – Not Found: Project or endpoint does not exist.
 * - 500 – Internal Server Error: Server encountered an error.
 *
 * @example
 * const { status, data: issues, error } = await getProjectIssues(789);
 * if (issues) {
 * console.log(`Workspaceed ${issues.length} issues for project 789`);
 * issues.forEach(issue => console.log(issue.title, issue.created));
 * } else {
 * console.error(`Error fetching project issues: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} projectId - The ID of the project whose issues are to be fetched.
 * @returns {Promise<GetProjectIssuesResult>} A promise resolving to an object containing the HTTP status,
 * an array of parsed Issue objects (or null), and an optional error message.
 */
export const getProjectIssues = async (
    projectId: number,
): Promise<GetProjectIssuesResult> => {
    const HYPOTHETICAL_ENDPOINT = "/get-project-issues"; // Verify actual endpoint name
    // try {
        const params = new URLSearchParams({
            projectid: String(projectId), // Verify actual query parameter name
        });

        const response = await fetch(
            `${API_BASE}${HYPOTHETICAL_ENDPOINT}?${params.toString()}`,
            {
                method: "GET",
            },
        );

        if (!response.ok) {
            const error = await parseErrorResponse(response);
            console.error(
                `Error fetching issues for project ${projectId}: Status ${response.status}, Message: ${error}`,
            );
            return { status: response.status, data: null, error };
        }

        const rawDataArray: RawIssueData[] = await response.json();
        const data: Issue[] = parseRawIssueArray(rawDataArray);
        return { status: response.status, data: data, error: undefined };
    // } catch (error: any) {
    //     console.error("Network or parsing error in getProjectIssues:", error.message);
    //     return {
    //         status: 0,
    //         data: null,
    //         error: error.message || "Network or parsing error",
    //     };
    // }
};

/**
 * Fetches issues for a specific organization ID.
 * ASSUMPTION: Requires a backend endpoint like GET /get-org-issues?orgid=...
 * This implementation is hypothetical and depends on the actual backend endpoint definition.
 * It parses the raw issue data, converting dates for each issue in the returned array.
 *
 * Relevant Status Codes (assuming a GET endpoint):
 * - 200 – OK: Issues successfully retrieved and parsed.
 * - 401 – Unauthorized: Authentication required.
 * - 403 – Forbidden: Insufficient permissions.
 * - 404 – Not Found: Organization or endpoint does not exist.
 * - 500 – Internal Server Error: Server encountered an error.
 *
 * @example
 * const { status, data: issues, error } = await getOrgIssues(101);
 * if (issues) {
 * console.log(`Workspaceed ${issues.length} issues for organization 101`);
 * issues.forEach(issue => console.log(issue.title, issue.created));
 * } else {
 * console.error(`Error fetching org issues: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} orgId - The ID of the organization whose issues are to be fetched.
 * @returns {Promise<GetOrgIssuesResult>} A promise resolving to an object containing the HTTP status,
 * an array of parsed Issue objects (or null), and an optional error message.
 */
export const getOrgIssues = async (
    orgId: number,
): Promise<GetOrgIssuesResult> => {
    const HYPOTHETICAL_ENDPOINT = "/get-org-issues"; // Verify actual endpoint name
    // try {
        const params = new URLSearchParams({
            orgid: String(orgId), // Verify actual query parameter name
        });

        const response = await fetch(
            `${API_BASE}${HYPOTHETICAL_ENDPOINT}?${params.toString()}`,
            {
                method: "GET",
            },
        );

        if (!response.ok) {
            const error = await parseErrorResponse(response);
            console.error(
                `Error fetching issues for organization ${orgId}: Status ${response.status}, Message: ${error}`,
            );
            return { status: response.status, data: null, error };
        }

        const rawDataArray: RawIssueData[] = await response.json();
        const data: Issue[] = parseRawIssueArray(rawDataArray);
        return { status: response.status, data: data, error: undefined };
    // } catch (error: any) {
    //     console.error("Network or parsing error in getOrgIssues:", error.message);
    //     return {
    //         status: 0,
    //         data: null,
    //         error: error.message || "Network or parsing error",
    //     };
    // }
};