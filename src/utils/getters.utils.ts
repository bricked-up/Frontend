import { API_BASE } from "../config";
import {
	User,
	Issue,
	// Import the result types from your main types file
	GetUserResult,
	GetIssueResult,
	GetProjectMembersResult,
	GetProjectIssuesResult,
	GetOrgIssuesResult,
} from "./types"; // Assuming types.ts is in the same directory

// --- Helper Function for Parsing Errors (Copied from post.utils.ts style) ---

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
		return typeof json.message === "string" ? json.message : text;
	} catch {
		return text;
	}
}

// --- Result Type Interfaces ---
// REMOVED FROM HERE - These should now be defined in ./types.ts
// export interface GetResult<T> { ... }
// export type GetUserResult = GetResult<User>;
// export type GetIssueResult = GetResult<Issue>;
// export type GetProjectMembersResult = GetResult<string[]>;
// export type GetProjectIssuesResult = GetResult<Issue[]>;
// export type GetOrgIssuesResult = GetResult<Issue[]>;

// --- Revised Getter Functions with Re-formatted Comments ---

/**
 * Fetches user data based on their User ID.
 * Aligned with backend GET /get-user endpoint which expects 'userid'.
 *
 * Relevant Status Codes:
 * 200 – OK: User data successfully retrieved.
 * 401 – Unauthorized: Authentication required.
 * 403 – Forbidden: Insufficient permissions.
 * 404 – Not Found: User with the specified ID does not exist.
 * 500 – Internal Server Error: Server encountered an error.
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
 * @returns {Promise<GetUserResult>} Promise resolving to an object containing status, User data (or null), and optional error message.
 */
export const getUser = async (userId: number): Promise<GetUserResult> => {
	try {
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
 * Relevant Status Codes:
 * 200 – OK: Issue data successfully retrieved.
 * 401 – Unauthorized: Authentication required.
 * 403 – Forbidden: Insufficient permissions.
 * 404 – Not Found: Issue with the specified ID does not exist.
 * 500 – Internal Server Error: Server encountered an error.
 *
 * @example
 * const { status, data: issue, error } = await getIssue(456);
 * if (issue) {
 * console.log("Fetched issue:", issue.name);
 * } else {
 * console.error(`Error fetching issue: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} issueId - The ID of the issue to fetch.
 * @returns {Promise<GetIssueResult>} Promise resolving to an object containing status, Issue data (or null), and optional error message.
 */
export const getIssue = async (issueId: number): Promise<GetIssueResult> => {
	try {
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
		// Add date parsing here if Issue type requires it and dates are returned as strings
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
 */

/**
 * NOTE: This function targets `/proj-members`, which might not exist or might
 * function differently than assumed (e.g., require GET instead of POST).
 * The implementation uses POST based on the original code snippet.
 * Its correctness depends entirely on the actual backend endpoint definition.
 *
 * Relevant Status Codes (assuming POST endpoint):
 * 200 – OK or 201 Created
 * 400 – Bad Request
 * 401 – Unauthorized
 * 403 – Forbidden
 * 404 – Not Found
 * 405 – Method Not Allowed
 * 500 – Internal Server Error
 *
 * @example
 * // Assuming project ID "proj-abc"
 * const { status, data: members, error } = await getProjectMembers("proj-abc");
 * if (members) {
 * console.log("Project members:", members);
 * } else {
 * console.error(`Error fetching members: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {string} projectIdentifier - The identifier (ID or name) of the project. Clarify based on backend.
 * @returns {Promise<GetProjectMembersResult>} Promise resolving to an object containing status, array of member identifiers (or null), and optional error message.
 */
export const getProjectMembers = async (
	projectIdentifier: string,
): Promise<GetProjectMembersResult> => {
	const HYPOTHETICAL_ENDPOINT = "/proj-members";
	try {
		const params = new URLSearchParams({
			project: projectIdentifier,
		});

		const response = await fetch(`${API_BASE}${HYPOTHETICAL_ENDPOINT}`, {
			method: "POST", // Verify; GET might be more appropriate
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
 * ASSUMPTION: Requires a backend endpoint like GET /get-project-issues?projectid=...
 * This implementation is hypothetical and depends on the actual backend endpoint.
 *
 * Relevant Status Codes (assuming GET endpoint):
 * 200 – OK
 * 401 – Unauthorized
 * 403 – Forbidden
 * 404 – Not Found
 * 500 – Internal Server Error
 *
 * @example
 * const { status, data: issues, error } = await getProjectIssues(789);
 * if (issues) {
 * console.log(`Fetched ${issues.length} issues for project 789`);
 * } else {
 * console.error(`Error fetching project issues: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} projectId - The ID of the project whose issues are to be fetched.
 * @returns {Promise<GetProjectIssuesResult>} Promise resolving to an object containing status, array of issues (or null), and optional error message.
 */
export const getProjectIssues = async (
	projectId: number,
): Promise<GetProjectIssuesResult> => {
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

		const data: Issue[] = await response.json();
		// Consider adding date parsing here if needed
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
 * ASSUMPTION: Requires a backend endpoint like GET /get-org-issues?orgid=...
 * This implementation is hypothetical and depends on the actual backend endpoint.
 *
 * Relevant Status Codes (assuming GET endpoint):
 * 200 – OK
 * 401 – Unauthorized
 * 403 – Forbidden
 * 404 – Not Found
 * 500 – Internal Server Error
 *
 * @example
 * const { status, data: issues, error } = await getOrgIssues(101);
 * if (issues) {
 * console.log(`Fetched ${issues.length} issues for organization 101`);
 * } else {
 * console.error(`Error fetching org issues: Status ${status}, Message: ${error}`);
 * }
 *
 * @param {number} orgId - The ID of the organization whose issues are to be fetched.
 * @returns {Promise<GetOrgIssuesResult>} Promise resolving to an object containing status, array of issues (or null), and optional error message.
 */
export const getOrgIssues = async (
	orgId: number,
): Promise<GetOrgIssuesResult> => {
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

		const data: Issue[] = await response.json();
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
