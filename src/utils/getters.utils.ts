import { API_BASE } from "../config";
import {
  User,
  Issue,
  Organization,
  Project,
  OrgMember,
  ProjectMember,
  GetUserResult,
  GetIssueResult,
  // GetUsersResult, // This type in types.ts might need to change to GetResult<number[]>
  GetResult, // Using GetResult directly for getAllUsers to specify number[]
  GetOrganizationResult,
  GetOrgMemberResult,
  GetProjectResult,
  GetProjectMemberResult,
  SQLNullTime,
} from "./types";

// --- Helper Function for Parsing Errors ---
async function parseErrorResponse(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) return response.statusText || `Request failed with status ${response.status}`;
  try {
    const json = JSON.parse(text);
    return typeof json.message === "string" ? json.message : text;
  } catch {
    return text; // Return raw text if it's not JSON or JSON message is not string
  }
}

// --- Helper Function for Parsing Dates ---
function parseSQLNullTime(sqlTime?: SQLNullTime | string | null): Date | null {
    if (!sqlTime) return null;
    if (typeof sqlTime === 'string') {
        const date = new Date(sqlTime);
        return isNaN(date.getTime()) ? null : date;
    }
    if (typeof sqlTime === 'object' && 'Valid' in sqlTime && 'Time' in sqlTime) {
        if (sqlTime.Valid && sqlTime.Time) {
            const date = new Date(sqlTime.Time);
            return isNaN(date.getTime()) ? null : date;
        }
    }
    return null;
}

// --- Getter Functions ---

export const getUser = async (userId: number): Promise<GetUserResult> => {
  try {
    const params = new URLSearchParams({ userid: String(userId) });
    const response = await fetch(`${API_BASE}/get-user?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404, 500. Note: 204 is response.ok = true
      const error = await parseErrorResponse(response);
      console.error(`Error fetching user ${userId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    const text = await response.text();
    // For getUser, the test expects data: {} for 204 when user not found,
    // so we explicitly create an empty User object if text is empty.
    const data: User = text ? JSON.parse(text) : ({} as User);

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getUser for ID ${userId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getIssue = async (issueId: number): Promise<GetIssueResult> => {
  try {
    const params = new URLSearchParams({ issueid: String(issueId) });
    const response = await fetch(`${API_BASE}/get-issue?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 for "Issue not found"
      const error = await parseErrorResponse(response);
      console.error(`Error fetching issue ${issueId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    // Assuming if response.ok, a valid JSON body is expected for an existing issue.
    // If "not found" is a 404 (handled above), then 200/204 with empty body shouldn't occur for an *existing* issue.
    // If a 204 could mean "found but no content to describe it specifically", more logic would be needed.
    // For now, keeping response.json() as per original for existing issues.
    const rawData = await response.json();
    const data: Issue = {
      ...rawData,
      tagId: rawData.tagid !== undefined ? rawData.tagid : rawData.tagId,
      created: parseSQLNullTime(rawData.created),
      completed: parseSQLNullTime(rawData.completed),
    };
    delete (data as any).tagid;
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getIssue for ID ${issueId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

// UPDATED for /get-all-users returning number[]
export const getAllUsers = async (): Promise<GetResult<number[]>> => {
  try {
    const response = await fetch(`${API_BASE}/get-all-users`, { method: "GET" });
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching all users: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    // Backend confirmed to return an array of user IDs
    const data: number[] = await response.json();
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error("Network or parsing error in getAllUsers:", error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getOrg = async (orgId: number): Promise<GetOrganizationResult> => {
  try {
    const params = new URLSearchParams({ orgid: String(orgId) });
    const response = await fetch(`${API_BASE}/get-org?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 if org not found (backend fix) or 500 for other errors
      const error = await parseErrorResponse(response);
      console.error(`Error fetching organization ${orgId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    // Assuming if response.ok, a valid JSON body is expected for an existing org.
    // Backend fixed malformed JSON for orgId=1.
    const data: Organization = await response.json();
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getOrg for ID ${orgId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

// UPDATED for orgid mapping and robust parsing
export const getOrgMember = async (memberId: number): Promise<GetOrgMemberResult> => {
  try {
    const params = new URLSearchParams({ memberid: String(memberId) });
    const response = await fetch(`${API_BASE}/get-org-member?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 if member not found (backend fix)
      const error = await parseErrorResponse(response);
      console.error(`Error fetching organization member ${memberId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    // Since 404 is handled, a 204 here would be less likely for "not found",
    // but could mean "found, no specific content to return beyond existence".
    // For now, assuming successful .ok response (and not 404) means valid data or an empty body that JSON.parse handles.
    // If 200 OK + empty body is possible for "not found" still, text check is better:
    const text = await response.text();
    if (!text && response.status !== 204) { // 204 implies empty body is intended.
                                           // If 200 OK with empty text, treat as no data.
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 204) { // Successfully processed, no content to return
        return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: OrgMember = {
      ...rawData,
      userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
      orgId: rawData.orgid !== undefined ? rawData.orgid : rawData.orgId, // Backend now sends orgid
    };
    delete (data as any).userid;
    delete (data as any).orgid;

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getOrgMember for ID ${memberId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getProject = async (projectId: number): Promise<GetProjectResult> => {
  try {
    const params = new URLSearchParams({ projectid: String(projectId) });
    const response = await fetch(`${API_BASE}/get-proj?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 (if backend sends it for not found) or 500
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project ${projectId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    const text = await response.text();
    // For getProject, test expects data: {} if not found (which it handles via 204 from backend)
    const parsedData = text ? JSON.parse(text) : {};
    const data: Project = parsedData as Project;

    if (data && data.issues && Object.keys(data).length > 0) {
        data.issues = data.issues.map(issue => ({
            ...issue,
            created: parseSQLNullTime(issue.created as any),
            completed: parseSQLNullTime(issue.completed as any),
            tagId: (issue as any).tagid !== undefined ? (issue as any).tagid : issue.tagId,
        }));
        // Clean up original tagid from issues if present after mapping
        if (data.issues) {
            data.issues.forEach(issue => delete (issue as any).tagid);
        }
    }
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProject for ID ${projectId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

// UPDATED for robust parsing
export const getProjectMember = async (memberId: number): Promise<GetProjectMemberResult> => {
  try {
    const params = new URLSearchParams({ memberid: String(memberId) });
    const response = await fetch(`${API_BASE}/get-proj-member?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 if member not found (backend fix)
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project member ${memberId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    const text = await response.text();
    if (!text && response.status !== 204) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 204) {
        return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: ProjectMember = {
        ...rawData,
        userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
        projectId: rawData.projectid !== undefined ? rawData.projectid : rawData.projectId,
    };
    delete (data as any).userid;
    delete (data as any).projectid;

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProjectMember for ID ${memberId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};