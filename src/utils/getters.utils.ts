import { API_BASE } from "../config";
import {
  User,
  Issue,
  Organization,
  Project,
  OrgMember,
  ProjectMember,
  OrgRole,      // Added for new getter
  ProjectRole,  // Added for new getter
  GetUserResult,
  GetIssueResult,
  GetResult,    // Using GetResult for getAllUsers
  GetOrganizationResult,
  GetOrgMemberResult,
  GetProjectResult,
  GetProjectMemberResult,
  GetOrgRoleResult,     // Added for new getter
  GetProjectRoleResult, // Added for new getter
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

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching user ${userId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
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

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching issue ${issueId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const rawData = await response.json(); // Consider robust parsing if issues can be "not found" with 200/empty
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

export const getAllUsers = async (): Promise<GetResult<number[]>> => {
  try {
    const response = await fetch(`${API_BASE}/get-all-users`, { method: "GET" });
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching all users: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const data: number[] = await response.json(); // Expects number[] now
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
    const data: Organization = await response.json(); // Backend fixed malformed JSON for orgId=1
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
    const text = await response.text();
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
        return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: OrgMember = {
      ...rawData,
      userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
      orgId: rawData.orgid !== undefined ? rawData.orgid : rawData.orgId,
      // Map aggregated permissions if backend sends them (as per OrgMember struct in backend docs)
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
      roles: rawData.roles, // This will be number[] as per backend struct
    };
    delete (data as any).userid;
    delete (data as any).orgid;
    // Optionally delete raw can_exec etc. if you only want camelCase from types.ts
    delete (data as any).can_exec; // Assuming these are present on rawData if true
    delete (data as any).can_read;
    delete (data as any).can_write;


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

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project ${projectId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    const parsedData = text ? JSON.parse(text) : {};
    const data: Project = parsedData as Project;

    if (data && data.issues && Object.keys(data).length > 0) {
        data.issues = data.issues.map(issue => ({
            ...issue,
            created: parseSQLNullTime(issue.created as any),
            completed: parseSQLNullTime(issue.completed as any),
            tagId: (issue as any).tagid !== undefined ? (issue as any).tagid : issue.tagId,
        }));
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

// UPDATED: Mapped can_exec, can_read, can_write from backend
export const getProjectMember = async (memberId: number): Promise<GetProjectMemberResult> => {
  try {
    const params = new URLSearchParams({ memberid: String(memberId) });
    const response = await fetch(`${API_BASE}/get-proj-member?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project member ${memberId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
        return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: ProjectMember = {
        ...rawData, // Spread first to include id and any other direct fields
        userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
        projectId: rawData.projectid !== undefined ? rawData.projectid : rawData.projectId,
        // Map aggregated permissions from backend (can_exec, etc.)
        canExec: rawData.can_exec,
        canRead: rawData.can_read,
        canWrite: rawData.can_write,
        roles: rawData.roles,    // This will be number[] from backend (array of role IDs)
        issues: rawData.issues,  // This will be number[] from backend (array of issue IDs)
    };
    // Clean up original lowercase keys
    delete (data as any).userid;
    delete (data as any).projectid;
    // Optionally delete raw can_exec etc. if you only want camelCase from types.ts
    // and if they were included by the spread of rawData.
    // However, the explicit mapping above should create the camelCase versions.
    // If rawData has can_exec, it will be on `data` too. If type `ProjectMember` expects `canExec`
    // (camelCase) then we are good. If `types.ts` has `can_exec` (snake_case) then no mapping needed for these.
    // Your `types.ts` was updated to expect camelCase `canExec` etc.
    // Let's delete the snake_case versions if they were spread from rawData.
    delete (data as any).can_exec;
    delete (data as any).can_read;
    delete (data as any).can_write;


    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProjectMember for ID ${memberId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

// --- START: New Getter Functions for OrgRole and ProjectRole ---

/**
 * Fetches a specific organization role by its ID.
 * Corresponds to backend GetOrgRoleHandler.
 */
export const getOrgRole = async (roleId: number): Promise<GetOrgRoleResult> => {
  try {
    const params = new URLSearchParams({ roleid: String(roleId) });
    const response = await fetch(`${API_BASE}/get-org-role?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 if role not found
      const error = await parseErrorResponse(response);
      console.error(`Error fetching organization role ${roleId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
        return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    // Backend OrgRole struct has: OrgID `json:"orgid"`, Name `json:"name"`,
    // CanExec `json:"can_exec"`, CanWrite `json:"can_write"`, CanRead `json:"can_read"`
    // Frontend OrgRole type expects: orgId, name, canExec, canWrite, canRead (all camelCase or matching)
    const data: OrgRole = {
      ...rawData, // id, name, can_exec, can_write, can_read would be spread
      orgId: rawData.orgid !== undefined ? rawData.orgid : rawData.orgId, // Map orgid
      // Ensure permissions are mapped to camelCase if types.ts expects it
      // and backend sends snake_case (which it does as per utils.pdf)
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
    };
    delete (data as any).orgid; // Clean up original lowercase field if it was on rawData
    // Delete snake_case permissions if they were spread and types.ts expects camelCase
    delete (data as any).can_exec;
    delete (data as any).can_read;
    delete (data as any).can_write;


    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getOrgRole for ID ${roleId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

/**
 * Fetches a specific project role by its ID.
 * Corresponds to backend GetProjRoleHandler.
 */
export const getProjectRole = async (roleId: number): Promise<GetProjectRoleResult> => {
  try {
    const params = new URLSearchParams({ roleid: String(roleId) });
    const response = await fetch(`${API_BASE}/get-proj-role?${params.toString()}`, { method: "GET" });

    if (!response.ok) { // Handles 404 if role not found
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project role ${roleId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
        return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    // Backend ProjectRole struct has: ProjectID `json:"projectid"`, Name `json:"name"`,
    // CanExec `json:"can_exec"`, CanWrite `json:"can_write"`, CanRead `json:"can_read"`
    // Frontend ProjectRole type expects: projectId, name, canExec, canWrite, canRead
    const data: ProjectRole = {
      ...rawData, // id, name, can_exec, can_write, can_read would be spread
      projectId: rawData.projectid !== undefined ? rawData.projectid : rawData.projectId, // Map projectid
      // Ensure permissions are mapped to camelCase
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
    };
    delete (data as any).projectid; // Clean up original lowercase field
    // Delete snake_case permissions if they were spread
    delete (data as any).can_exec;
    delete (data as any).can_read;
    delete (data as any).can_write;

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProjectRole for ID ${roleId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

// --- END: New Getter Functions ---