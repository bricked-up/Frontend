import { Issue, Organization, Project } from "./types";
import { API_BASE } from "../config";

export interface IssueParams {
  title: string;
  desc?: string | null;
  priority: number;
  cost?: number;
  projectid: number;
  tagid: number;
}

export interface Result {
  status: number;
  error?: string;
}

export interface NewOrganizationParams {
  orgName: string;
  projects?: number[];
}

export interface CreateOrganizationResult {
  status: number;
  organization: Organization | null;
  error?: string;
}

export interface NewProjectParams {
  name: string;
  orgId: number;
  tag: string;
  budget: number;
  charter: string;
  archived: boolean;
  members?: string[];
  issues?: string[];
}

export interface CreateProjectResult {
  status: number;
  project: Project | null;
  error?: string;
}

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


function formatDateForBackend(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Creates a new issue on the server.
 * If successful, returns the HTTP status and the created Issue object.
 *
 * 201 – Created: issue was successfully created
 * 400 – Bad Request: invalid input data
 * 401 – Unauthorized: authentication required
 * 403 – Forbidden: insufficient permissions
 * 405 – Method Not Allowed: wrong HTTP method
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const { status, issue, error } = await createNewIssue(
 *   { name: "Bug #123", description: "Crash on load", priority: 1, cost: 0 },
 *   "issues"
 * );
 * if (issue) {
 *   console.log("Created:", issue.id);
 * } else {
 *   console.error(`Error ${status}: ${error}`);
 * }
 *
 * @param {IssueParams} paramsObj - The data for the new issue
 * @param {string} endpoint - The API endpoint (e.g. "issues")
 * @returns {Promise<Result>} Promise resolving to status, Issue (or null), and optional error
 */
export const createNewIssue = async (
  paramsObj: IssueParams,
  endpoint: string
): Promise<Result> => {
  try {
    const sessionid = localStorage.getItem("sessionid") || "";
    const params = new URLSearchParams();

    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value != null) {
        params.append(key, String(value));
      }
    });

    params.append("sessionid", sessionid);

    const now = new Date();
    params.append("date", formatDateForBackend(now));
    params.append("completed", formatDateForBackend(now));



    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, error };
    }


    console.log("meooow");
    console.log(response.status);
    return { status: response.status };
  } catch (err: any) {
    console.log("meow");
    return { status: 0, error: err.message || "Unknown error!" };
  }
};



/**
 * Creates a new organization, optionally linking existing project IDs.
 *
 * 201 – Created: organization was successfully created
 * 400 – Bad Request: invalid organization data
 * 401 – Unauthorized: authentication required
 * 403 – Forbidden: insufficient permissions
 * 405 – Method Not Allowed: wrong HTTP method
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const { status, organization, error } = await createOrganization(
 *   { name: "Acme Corp", projects: ["proj1", "proj2"] },
 *   "organizations"
 * );
 * if (organization) {
 *   console.log("Created org:", organization.id);
 * } else {
 *   console.error(`Error ${status}: ${error}`);
 * }
 *
 * @param {NewOrganizationParams} paramsObj - The data for the new organization
 * @param {string} endpoint - The API endpoint (e.g. "organizations")
 * @returns {Promise<CreateOrganizationResult>} status, Organization (or null), and optional error
 */
export const createOrganization = async (
  paramsObj: NewOrganizationParams,
  endpoint: string
): Promise<CreateOrganizationResult> => {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    });
    const sessionid = localStorage.getItem("sessionid");
    if (sessionid) {
      params.append("sessionid", sessionid);
    }


    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const errorText = await response.text();
    console.log("Response body:", errorText);
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, organization: null, error };
    }

    const rawJson: any = await response.json();

    const organization: Organization = {
      id: rawJson.id,
      name: rawJson.name,
      projects: rawJson.projects ?? [],
      members: rawJson.members ?? [],
      roles: rawJson.roles ?? [],
    };

    return { status: response.status, organization };
  } catch (err: any) {
    return {
      status: 0,
      organization: null,
      error: err.message || "Unknown error",
    };
  }
};

/**
 * Creates a new project within a given organization.
 *
 * 201 – Created: project was successfully created
 * 400 – Bad Request: invalid project data
 * 401 – Unauthorized: authentication required
 * 403 – Forbidden: insufficient permissions
 * 405 – Method Not Allowed: wrong HTTP method
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const { status, project, error } = await createProject(
 *   {
 *     name: "New App",
 *     orgId: 1,
 *     tag: "v1.0",
 *     budget: 5000,
 *     charter: "Initial build",
 *     archived: false,
 *     members: ["alice", "bob"],
 *     issues: []
 *   },
 *   "projects"
 * );
 * if (project) {
 *   console.log("Created project:", project.id);
 * } else {
 *   console.error(`Error ${status}: ${error}`);
 * }
 *
 * @param {NewProjectParams} paramsObj - The data for the new project
 * @param {string} endpoint - The API endpoint (e.g. "projects")
 * @returns {Promise<CreateProjectResult>} status, Project (or null), and optional error
 */
export const createProject = async (
  paramsObj: NewProjectParams,
  endpoint: string
): Promise<Number> => {
  try {
    const params = new URLSearchParams();
    const sessionid = localStorage.getItem("sessionid");
    params.append("sessionid", String(sessionid));
    params.append("name", paramsObj.name);
    params.append("orgid", String(paramsObj.orgId));
    params.append("budget", String(paramsObj.budget));
    params.append("charter", paramsObj.charter);
    params.append("archived", '0');

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      return 500;
    }

    return response.status;
  } catch (error: any) {
    window.alert(`Error with the server: ${error}`)
    return 500;
  }
};
//remove member from project
export const removeProjectMember = async (
  sessionId: number,
  memberId: number
): Promise<Result> => {
  try {
    const params = new URLSearchParams({
      sessionid: String(sessionId),
      memberid: String(memberId),
    }).toString();

    console.log("DELETE /remove-proj-member");
    const response = await fetch(`${API_BASE}/remove-proj-member{params}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, error };
    }

    return { status: response.status };
  } catch (err: any) {
    return {
      status: 0,
      error: err.message || "Unknown error",
    };
  }
};

//remove member from organization
export const removeOrgMember = async (
  sessionId: number,
  memberId: number
): Promise<Result> => {
  try {
    const params = new URLSearchParams({
      sessionid: String(sessionId),
      memberid: String(memberId),
    });

    console.log("DELETE /remove-org-member");
    console.log("Body Params:", params);

    const response = await fetch(`${API_BASE}/remove-org-member`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, error };
    }

    return { status: response.status };
  } catch (err: any) {
    return {
      status: 0,
      error: err.message || "Unknown error",
    };
  }
};
