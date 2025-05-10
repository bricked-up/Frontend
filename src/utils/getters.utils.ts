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
  GetUsersResult,
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

    // For 204 No Content, response.ok is true.
    // If !response.ok, it's an actual error status like 404, 500.
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching user ${userId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    const text = await response.text();
    // If text is empty (e.g., from a 204 response), data becomes {}. 
    // If text is non-empty but invalid JSON, JSON.parse() will throw, caught by outer catch.
    const data: User = text ? JSON.parse(text) : ({} as User); 
                                                              
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    // This catch block handles network errors, or JSON.parse() errors if text is invalid JSON.
    console.error(`Network or parsing error in getUser for ID ${userId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getIssue = async (issueId: number): Promise<GetIssueResult> => {
  try {
    const params = new URLSearchParams({ issueid: String(issueId) });
    const response = await fetch(`${API_BASE}/get-issue?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching issue ${issueId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    // getIssue continues to use response.json() directly.
    // If backend sends 200/204 OK + empty body for an issue, .json() would throw and be caught.
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

export const getAllUsers = async (): Promise<GetUsersResult> => {
  try {
    const response = await fetch(`${API_BASE}/get-all-users`, { method: "GET" });
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching all users: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const data: User[] = await response.json();
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
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching organization ${orgId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const data: Organization = await response.json();
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getOrg for ID ${orgId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getOrgMember = async (memberId: number): Promise<GetOrgMemberResult> => {
  try {
    const params = new URLSearchParams({ memberid: String(memberId) });
    const response = await fetch(`${API_BASE}/get-org-member?${params.toString()}`, { method: "GET" });
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching organization member ${memberId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const rawData = await response.json();
    const data: OrgMember = {
      ...rawData,
      userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
    };
    delete (data as any).userid;
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

    // For 204 No Content, response.ok is true.
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project ${projectId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }

    const text = await response.text();
    const parsedData = text ? JSON.parse(text) : {}; // If text is empty, data is {}
    
    const data: Project = parsedData as Project;

    // Map issues within the project if they exist and data is not just {}
    if (data && data.issues && Object.keys(data).length > 0) {
        data.issues = data.issues.map(issue => ({
            ...issue,
            created: parseSQLNullTime(issue.created as any),
            completed: parseSQLNullTime(issue.completed as any),
            tagId: (issue as any).tagid !== undefined ? (issue as any).tagid : issue.tagId,
        }));
    }
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProject for ID ${projectId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getProjectMember = async (memberId: number): Promise<GetProjectMemberResult> => {
  try {
    const params = new URLSearchParams({ memberid: String(memberId) });
    const response = await fetch(`${API_BASE}/get-proj-member?${params.toString()}`, { method: "GET" });
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project member ${memberId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const rawData = await response.json();
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