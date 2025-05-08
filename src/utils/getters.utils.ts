import { API_BASE } from "../config";
import {
    User,
    Issue,
    GetUserResult,
    GetIssueResult,
    GetProjectMembersResult,
    GetProjectIssuesResult,
    GetOrgIssuesResult,
} from "./types"; // Assuming types.ts is in the same directory

// --- Helper Function for Parsing Errors ---
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

// --- Helper Types for Raw Backend Data ---
// (These would ideally be fully defined or aligned with a shared backend types definition)

interface SQLNullTime {
    Time: string;
    Valid: boolean;
}

// Represents the raw structure of an Issue as it might come from the backend
interface RawIssueData {
    id: number;
    title: string;
    desc?: string | null;
    tagId?: number | null; // Assuming backend might send tagId (or tagid, see test)
    tagid?: number | null; // To handle potential inconsistency noted in tests
    priority?: number | null;
    created: string; // Expected as an ISO string
    completed?: SQLNullTime | null; // Expected as Go's sql.NullTime structure
    cost: number;
    dependencies?: any[]; // Define more strictly if possible
    reminders?: any[]; // Define more strictly if possible
    // Any other fields that might be on the raw issue data
}

// --- Helper Function to Parse Raw Issue Data ---
function parseRawIssueData(raw: RawIssueData): Issue {
    return {
        ...raw,
        tagId: raw.tagId ?? raw.tagid, // Prefer tagId, fallback to tagid
        created: new Date(raw.created),
        completed: raw.completed && raw.completed.Valid ? new Date(raw.completed.Time) : null,
    };
}

function parseRawIssueArray(rawIssues: RawIssueData[]): Issue[] {
    return rawIssues.map(parseRawIssueData);
}


// --- Revised Getter Functions ---

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

        // Assuming User type from backend matches types.ts directly for non-date fields
        // If User also had dates needing parsing, a similar raw/parse pattern would be used
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

export const getProjectMembers = async (
    projectIdentifier: string,
): Promise<GetProjectMembersResult> => {
    const HYPOTHETICAL_ENDPOINT = "/proj-members";
    // try {
        const params = new URLSearchParams({
            project: projectIdentifier,
        });

        const response = await fetch(`${API_BASE}${HYPOTHETICAL_ENDPOINT}`, {
            method: "POST",
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

        const data: string[] = await response.json(); // Assuming this endpoint correctly returns string[] as per current type
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

export const getProjectIssues = async (
    projectId: number,
): Promise<GetProjectIssuesResult> => {
    const HYPOTHETICAL_ENDPOINT = "/get-project-issues";
    // try {
        const params = new URLSearchParams({
            projectid: String(projectId),
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

export const getOrgIssues = async (
    orgId: number,
): Promise<GetOrgIssuesResult> => {
    const HYPOTHETICAL_ENDPOINT = "/get-org-issues";
    // try {
        const params = new URLSearchParams({
            orgid: String(orgId),
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