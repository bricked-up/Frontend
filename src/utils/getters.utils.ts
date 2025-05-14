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
  Dependency,
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

// --- Helper Function for Parsing Nullable Dates ---
// This function remains for fields that CAN be null, like 'completed'
function parseSQLNullTime(sqlTime?: SQLNullTime | string | null): Date | null {
  if (!sqlTime) return null;
  if (typeof sqlTime === 'string') {
    const date = new Date(sqlTime);
    return isNaN(date.getTime()) ? null : date;
  }
  // Ensure sqlTime is an object and not null before checking for properties
  if (typeof sqlTime === 'object' && sqlTime !== null && 'Valid' in sqlTime && 'Time' in sqlTime) {
    // Cast to SQLNullTime to satisfy TypeScript, assuming the checks are sufficient
    const sqlTimeObj = sqlTime as SQLNullTime;
    if (sqlTimeObj.Valid && sqlTimeObj.Time) {
      const date = new Date(sqlTimeObj.Time);
      return isNaN(date.getTime()) ? null : date;
    }
  }
  return null;
}

// --- NEW Helper Function for Parsing REQUIRED Dates ---
// This function is for fields like 'created' that CANNOT be null.
// It will throw an error if the date is null, invalid, or not present.
function parseRequiredSQLTime(sqlTime: SQLNullTime | string | undefined | null, fieldNameForError: string): Date {
  if (!sqlTime) {
    throw new Error(`Required date field '${fieldNameForError}' was null, undefined, or empty.`);
  }

  let parsedDate: Date | null = null;

  if (typeof sqlTime === 'string') {
    const date = new Date(sqlTime);
    if (!isNaN(date.getTime())) {
      parsedDate = date;
    }
  } else if (typeof sqlTime === 'object' && sqlTime !== null && 'Valid' in sqlTime && 'Time' in sqlTime) {
    // Cast to SQLNullTime, assuming the checks are sufficient
    const sqlTimeObj = sqlTime as SQLNullTime;
    if (sqlTimeObj.Valid && sqlTimeObj.Time) {
      const date = new Date(sqlTimeObj.Time);
      if (!isNaN(date.getTime())) {
        parsedDate = date;
      }
    } else if (!sqlTimeObj.Valid) {
      // Explicitly throw if Valid is false for a required field
      throw new Error(`Required date field '${fieldNameForError}' received SQLNullTime with Valid: false.`);
    }
  }

  if (parsedDate) {
    return parsedDate;
  } else {
    // If parsing failed for other reasons (e.g. invalid date string within a valid structure)
    throw new Error(`Required date field '${fieldNameForError}' could not be parsed into a valid date from input: ${JSON.stringify(sqlTime)}`);
  }
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
    const rawData = await response.json();
    const data: Issue = {
      ...rawData,
      tagId: rawData.tagid !== undefined ? rawData.tagid : rawData.tagId,
      // Use parseRequiredSQLTime for 'created' as it cannot be null
      created: parseRequiredSQLTime(rawData.created, `Issue [${issueId}] 'created' field`),
      // Use parseSQLNullTime for 'completed' as it can be null
      completed: parseSQLNullTime(rawData.completed),
    };
    delete (data as any).tagid;
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    // Errors from parseRequiredSQLTime will also be caught here
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
    // Preserving your original logic for handling empty text / 404 for this function
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    // This explicit 404 check is redundant if the `!response.ok` block correctly handles 404s by returning.
    // However, keeping it to match your provided code precisely.
    if (response.status === 404) {
      return { status: response.status, data: null, error: undefined };
    }
    // If text is empty at this point (e.g. after passing the above checks for some reason), JSON.parse will throw.
    const rawData = JSON.parse(text);
    const data: OrgMember = {
      ...rawData,
      userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
      orgId: rawData.orgid !== undefined ? rawData.orgid : rawData.orgId,
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
      roles: rawData.roles,
    };
    delete (data as any).userid;
    delete (data as any).orgid;
    delete (data as any).can_exec;
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
      // The .map operation might throw if parseRequiredSQLTime fails for any issue's 'created' field.
      // This error would be caught by the outer catch block for getProject.
      data.issues = data.issues.map(issue => {
        // Assuming 'issue' here is a raw object from the backend data.
        // The `as any` for issue.created and issue.completed is kept from your original code.
        const issueIdForError = issue.id || 'unknown'; // For better error messages
        const transformedIssue = {
          ...issue,
          // Use parseRequiredSQLTime for 'created'
          //created: parseRequiredSQLTime(issue.created, `Project [${projectId}] Issue [${issueIdForError}] 'created' field`) as unknown as string | SQLNullTime | null | undefined,
          // Use parseSQLNullTime for 'completed'
          completed: parseSQLNullTime((issue as any).completed),
          tagId: (issue as any).tagid !== undefined ? (issue as any).tagid : (issue as any).tagId,
        };
        delete (transformedIssue as any).tagid;
        return transformedIssue;
      });
      // The 'if (data.issues)' check before forEach is slightly redundant if map always runs on an existing array,
      // but kept as per original structure.
      if (data.issues) {
        // This forEach loop was for deleting tagid, which is now done inside the map's transformedIssue.
        // data.issues.forEach(issue => delete (issue as any).tagid); // This line is no longer needed here.
      }
    }
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    // Errors from parseRequiredSQLTime within the issues.map will also be caught here
    console.error(`Network or parsing error in getProject for ID ${projectId}:`, error.message, error);
    return { status: 200, data: null, error: error.message || "Network or parsing error" };
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
    const text = await response.text();
    // Preserving your original logic for handling empty text / 404 for this function
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
      return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: ProjectMember = {
      ...rawData, 
      userId: rawData.userid !== undefined ? rawData.userid : rawData.userId,
      projectId: rawData.projectid !== undefined ? rawData.projectid : rawData.projectId,
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
      roles: rawData.roles,
      issues: rawData.issues,
    };
    delete (data as any).userid;
    delete (data as any).projectid;
    delete (data as any).can_exec;
    delete (data as any).can_read;
    delete (data as any).can_write;

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProjectMember for ID ${memberId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getOrgRole = async (roleId: number): Promise<GetOrgRoleResult> => {
  try {
    const params = new URLSearchParams({ roleid: String(roleId) });
    const response = await fetch(`${API_BASE}/get-org-role?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching organization role ${roleId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    // Preserving your original logic for handling empty text / 404 for this function
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
      return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: OrgRole = {
      ...rawData,
      orgId: rawData.orgid !== undefined ? rawData.orgid : rawData.orgId,
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
    };
    delete (data as any).orgid;
    delete (data as any).can_exec;
    delete (data as any).can_read;
    delete (data as any).can_write;

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getOrgRole for ID ${roleId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getProjectRole = async (roleId: number): Promise<GetProjectRoleResult> => {
  try {
    const params = new URLSearchParams({ roleid: String(roleId) });
    const response = await fetch(`${API_BASE}/get-proj-role?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching project role ${roleId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    // Preserving your original logic for handling empty text / 404 for this function
    if (!text && response.status !== 404) {
      return { status: response.status, data: null, error: undefined };
    }
    if (response.status === 404) {
      return { status: response.status, data: null, error: undefined };
    }

    const rawData = JSON.parse(text);
    const data: ProjectRole = {
      ...rawData,
      projectId: rawData.projectid !== undefined ? rawData.projectid : rawData.projectId,
      canExec: rawData.can_exec,
      canRead: rawData.can_read,
      canWrite: rawData.can_write,
    };
    delete (data as any).projectid;
    delete (data as any).can_exec;
    delete (data as any).can_read;
    delete (data as any).can_write;

    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProjectRole for ID ${roleId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

  /**
  * Fetches all projects associated with a specific user.
  * Internally uses `getUser` and `getProject` to resolve full project details.
  * Returns an array of `Project` objects or an error if the user or any project fetch fails critically.
  */
  export const getUserProjects = async (userId: number): Promise<GetResult<Project[]>> => {
    try {
      const userResult = await getUser(userId);
      if (userResult.status !== 200 || !userResult.data) {
        return {
          status: userResult.status,
          data: null,
          error: userResult.error || "User not found",
        };
      }
  
      const rawProjects = userResult.data.projects ?? [];
  
      // Only include number IDs from (number | ProjectMember)[]
      const projectIds = rawProjects.filter(
        (p): p is number => typeof p === "number"
      );
  
      const projects: Project[] = [];
  
      for (const id of projectIds) {
        const projectResult = await getProject(id);
        if (projectResult.status === 200 && projectResult.data) {
          const raw = projectResult.data;
  
          const transformedProject: Project = {
            ...raw,
            orgId: (raw as any).orgid !== undefined ? (raw as any).orgid : raw.orgId,
          };
          delete (transformedProject as any).orgid;
  
          projects.push(transformedProject);
        }
      }
  
      return { status: 200, data: projects, error: undefined };
    } catch (error: any) {
      return { status: 0, data: null, error: error.message || "Unexpected error" };
    }
  };
  

  export const getDependency = async (dependencyId: number): Promise<GetResult<Dependency>> => {
  try {
    const params = new URLSearchParams({ dependencyid: String(dependencyId) });
    const response = await fetch(`${API_BASE}/get-dependency?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching dependency ${dependencyId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const text = await response.text();
    const data: Dependency = text ? JSON.parse(text) : ({} as Dependency);
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getDependency for ID ${dependencyId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getDependenciesForIssue = async (issueId: number): Promise<GetResult<Dependency[]>> => {
  try {
    const params = new URLSearchParams({ issueid: String(issueId) });
    const response = await fetch(`${API_BASE}/get-issue-dependencies?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching dependencies for issue ${issueId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    const data: Dependency[] = await response.json();
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getDependenciesForIssue for issue ID ${issueId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};

export const getProjectIssues = async (projectId: number): Promise<GetResult<Issue[]>> => {
  try {
    const params = new URLSearchParams({ projectid: String(projectId) });
    const response = await fetch(`${API_BASE}/get-project-issues?${params.toString()}`, { method: "GET" });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      console.error(`Error fetching issues for project ${projectId}: Status ${response.status}, Message: ${error}`);
      return { status: response.status, data: null, error };
    }
    
    const rawData = await response.json();
    const data: Issue[] = rawData.map((issue: any) => ({
      ...issue,
      tagId: issue.tagid !== undefined ? issue.tagid : issue.tagId,
      created: parseRequiredSQLTime(issue.created, `Issue [${issue.id}] 'created' field`),
      completed: parseSQLNullTime(issue.completed),
    }));
    
    return { status: response.status, data: data, error: undefined };
  } catch (error: any) {
    console.error(`Network or parsing error in getProjectIssues for project ID ${projectId}:`, error.message, error);
    return { status: 0, data: null, error: error.message || "Network or parsing error" };
  }
};
