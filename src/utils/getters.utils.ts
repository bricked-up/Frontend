import { API_BASE } from "../config"; // Added import for API base URL
import { User, Issue } from "./types"; // Assuming these types are correctly defined

// --- Helper Function for Parsing Errors (similar to post.utils.ts) ---

/**
 * Try to extract an error message from the response body.
 * Falls back to raw text or response.statusText if parsing fails.
 *
 * @param {Response} response - The fetch response to parse
 * @returns {Promise<string>} a human-readable error message
 */
async function parseErrorResponse(response: Response): Promise<string> {
	const text = await response.text().catch(() => "");
	if (!text) return response.statusText;
	try {
		const json = JSON.parse(text);
		// Adjust based on actual error response structure from GET endpoints if different
		return typeof json.message === "string" ? json.message : text;
	} catch {
		return text;
	}
}

// --- Result Type Interfaces (similar to post.utils.ts) ---

export interface GetResult<T> {
	status: number;
	data: T | null;
	error?: string;
}

export type GetUserResult = GetResult<User>;
export type GetIssueResult = GetResult<Issue>;
export type GetProjectMembersResult = GetResult<string[]>; // Assuming string IDs for members
export type GetProjectIssuesResult = GetResult<Issue[]>;
export type GetOrgIssuesResult = GetResult<Issue[]>;

// --- Revised Getter Functions ---

/**
 * Fetches user data based on their User ID.
 * Aligned with backend GET /get-user endpoint which expects 'userid'.
 *
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<GetUserResult>} Object containing status, User data (or null), and optional error.
 */
export const getUser = async (userId: number): Promise<GetUserResult> => {
	try {
		// Backend expects 'userid' (lowercase) as a URL query parameter
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
	} catch (error: any) {
		console.error("Network or parsing error in getUser:", error.message);
		return {
			status: 0,
			data: null,
			error: error.message || "Network or parsing error",
		};
	}
};

/**
 * Fetches a specific issue based on its ID.
 * Aligned with backend GET /get-issue endpoint which expects 'issueid'.
 *
 * @param {number} issueId - The ID of the issue to fetch.
 * @returns {Promise<GetIssueResult>} Object containing status, Issue data (or null), and optional error.
 */
export const getIssue = async (issueId: number): Promise<GetIssueResult> => {
	try {
		// Backend /get-issue expects 'issueid' (lowercase) as a URL query parameter
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

		const data: Issue = await response.json();
		// Add date parsing if Issue type requires it (like in post.utils.ts)
		// Example:
		// const rawData = await response.json();
		// const data: Issue = {
		//   ...rawData,
		//   created: new Date(rawData.created),
		//   completed: new Date(rawData.completed),
		// };
		return { status: response.status, data: data, error: undefined };
	} catch (error: any) {
		console.error("Network or parsing error in getIssue:", error.message);
		return {
			status: 0,
			data: null,
			error: error.message || "Network or parsing error",
		};
	}
};

/*
 * Removed function `getUserIssues_DEPRECATED_MISLEADING`.
 * Reason: It targeted the `/get-user` endpoint, which returns User data, not Issue data.
 * Its name was misleading and functionality duplicated `getUser`.
 * A correct implementation would require a dedicated backend endpoint,
 * e.g., GET /users/{userId}/issues or GET /issues?userId={userId}.
 */

/**
 * NOTE: This function targets `/proj-members`, which might not exist or might
 * function differently than assumed. The original implementation used POST with
 * a form body, which is kept here, but fetching data is more commonly a GET request.
 * This function's correctness depends entirely on the actual backend endpoint.
 *
 * @param {string} projectIdentifier - Likely project ID or name (clarify based on backend).
 * @returns {Promise<GetProjectMembersResult>} Object containing status, array of member identifiers (or null), and optional error.
 */
export const getProjectMembers = async (
	projectIdentifier: string,
): Promise<GetProjectMembersResult> => {
	// This endpoint and its expected method/parameters are uncertain.
	const HYPOTHETICAL_ENDPOINT = "/proj-members";
	try {
		// Assuming 'project' is the correct parameter name for the hypothetical endpoint
		// and the backend expects it in the body for a POST request.
		const params = new URLSearchParams({
			project: projectIdentifier, // Or perhaps 'projectId' if it expects an ID
		});

		const response = await fetch(`${API_BASE}${HYPOTHETICAL_ENDPOINT}`, {
			method: "POST", // Kept as POST based on original; verify if GET is more appropriate
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

		const data: string[] = await response.json(); // Assuming backend returns an array of strings
		return { status: response.status, data: data, error: undefined };
	} catch (error: any) {
		console.error(
			"Network or parsing error in getProjectMembers:",
			error.message,
		);
		return {
			status: 0,
			data: null,
			error: error.message || "Network or parsing error",
		};
	}
};

// --- TODO / Hypothetical Implementations ---

/**
 * Fetches issues for a specific project ID.
 * ASSUMPTION: Requires a backend endpoint like GET /projects/{projectId}/issues or GET /issues?projectId=...
 * This implementation assumes GET /get-project-issues?projectid=... for consistency with original comments.
 *
 * @param {number} projectId - The ID of the project.
 * @returns {Promise<GetProjectIssuesResult>} Object containing status, array of issues (or null), and optional error.
 */
export const getProjectIssues = async (
	projectId: number,
): Promise<GetProjectIssuesResult> => {
	// This endpoint does not exist in the provided backend code.
	// This is a *hypothetical* implementation assuming a GET endpoint.
	const HYPOTHETICAL_ENDPOINT = "/get-project-issues"; // Verify actual endpoint
	try {
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

		const data: Issue[] = await response.json(); // Assuming backend returns array of Issue objects
		// Consider adding date parsing here if needed for Issue objects fetched via GET
		return { status: response.status, data: data, error: undefined };
	} catch (error: any) {
		console.error("Network or parsing error in getProjectIssues:", error.message);
		return {
			status: 0,
			data: null,
			error: error.message || "Network or parsing error",
		};
	}
};

/**
 * Fetches issues for a specific organization ID.
 * ASSUMPTION: Requires a backend endpoint like GET /organizations/{orgId}/issues or GET /issues?orgId=...
 * This implementation assumes GET /get-org-issues?orgid=... for consistency with original comments.
 *
 * @param {number} orgId - The ID of the organization.
 * @returns {Promise<GetOrgIssuesResult>} Object containing status, array of issues (or null), and optional error.
 */
export const getOrgIssues = async (
	orgId: number,
): Promise<GetOrgIssuesResult> => {
	// This endpoint does not exist in the provided backend code.
	// This is a *hypothetical* implementation assuming a GET endpoint.
	const HYPOTHETICAL_ENDPOINT = "/get-org-issues"; // Verify actual endpoint
	try {
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

		const data: Issue[] = await response.json(); // Assuming backend returns array of Issue objects
		// Consider adding date parsing here if needed
		return { status: response.status, data: data, error: undefined };
	} catch (error: any) {
		console.error("Network or parsing error in getOrgIssues:", error.message);
		return {
			status: 0,
			data: null,
			error: error.message || "Network or parsing error",
		};
	}
};