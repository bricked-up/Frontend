import { Issue, Organization, Project } from "./types";
import { API_BASE } from "../config";

export interface IssueParams {
  name: string;
  description?: string | null;
  priority: number;
  cost?: number;
}

export interface Result {
  status: number;
  issue: Issue | null;
  error?: string;
}

export interface NewOrganizationParams {
  name: string;
  projects?: string[];
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

export interface TagParams {
  sessionId: number;
  projectId: number;
  name: string;
  color: string;
}

export interface TagResult {
  status: number;
  error?: string;
}

export interface DeleteTagParams {
  sessionId: number;
  tagId: number;
}

export interface DeleteTagResult {
  status: number;
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

/**
 * Creates a new issue on the server.
 * If successful, returns only the HTTP status (no JSON body).
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
 * if (issue === null && status === 201) {
 *   console.log("Issue created!");
 * } else {
 *   console.error(`Error ${status}: ${error}`);
 * }
 *
 * @param {IssueParams} paramsObj - The data for the new issue
 * @param {string} endpoint - The API endpoint (e.g. "issues")
 * @returns {Promise<Result>} Promise resolving to status, null issue, and optional error
 */
export const createNewIssue = async (
  paramsObj: IssueParams,
  endpoint: string
): Promise<Result> => {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value != null) {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, issue: null, error };
    }

    // no JSON body returned on success
    return { status: response.status, issue: null };
  } catch (err: any) {
    return { status: 0, issue: null, error: err.message || "Unknown error" };
  }
};

/**
 * Creates a new organization, optionally linking existing project IDs.
 * Returns only the HTTP status (no JSON body).
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
 * if (organization === null && status === 201) {
 *   console.log("Organization created!");
 * } else {
 *   console.error(`Error ${status}: ${error}`);
 * }
 *
 * @param {NewOrganizationParams} paramsObj - The data for the new organization
 * @param {string} endpoint - The API endpoint (e.g. "organizations")
 * @returns {Promise<CreateOrganizationResult>} status, null organization, and optional error
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

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, organization: null, error };
    }

    // no JSON body returned on success
    return { status: response.status, organization: null };
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
 * Returns only the HTTP status (no JSON body).
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
 * if (project === null && status === 201) {
 *   console.log("Project created!");
 * } else {
 *   console.error(`Error ${status}: ${error}`);
 * }
 *
 * @param {NewProjectParams} paramsObj - The data for the new project
 * @param {string} endpoint - The API endpoint (e.g. "projects")
 * @returns {Promise<CreateProjectResult>} status, null project, and optional error
 */
export const createProject = async (
  paramsObj: NewProjectParams,
  endpoint: string
): Promise<CreateProjectResult> => {
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

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, project: null, error };
    }

    // no JSON body returned on success
    return { status: response.status, project: null };
  } catch (err: any) {
    return { status: 0, project: null, error: err.message || "Unknown error" };
  }
};

/**
 * Creates a new tag on the server.
 *
 * 201 – Created: tag was successfully created  
 * 400 – Bad Request: invalid or missing form data  
 * 401 – Unauthorized: session invalid  
 * 403 – Forbidden: insufficient permissions  
 * 405 – Method Not Allowed: wrong HTTP method  
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const result = await createTag(
 *   { sessionId: 123, projectId: 42, name: "bug", color: "#ff0000" },
 *   "create-tag"
 * );
 * if (result.status === 201) {
 *   console.log("Tag created!");
 * } else {
 *   console.error(`Error ${result.status}: ${result.error}`);
 * }
 *
 * @param {TagParams} paramsObj - session, project ID, name & color
 * @param {string} endpoint - e.g. "create-tag"
 * @returns {Promise<TagResult>} status + optional error message
 */
export const createTag = async (
  paramsObj: TagParams,
  endpoint: string
): Promise<TagResult> => {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, error };
    }

    return { status: response.status };
  } catch (err: any) {
    return { status: 0, error: err.message || "Unknown error" };
  }
};

/**
 * Deletes a tag by its ID.
 *
 * 200 – OK: tag was successfully deleted  
 * 400 – Bad Request: invalid or missing form data  
 * 401 – Unauthorized: session invalid  
 * 403 – Forbidden: cannot delete this tag  
 * 405 – Method Not Allowed: wrong HTTP method  
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const result = await deleteTag(
 *   { sessionId: 123, tagId: 99 },
 *   "delete-tag"
 * );
 * if (result.status === 200) {
 *   console.log("Tag deleted");
 * } else {
 *   console.error(`Error ${result.status}: ${result.error}`);
 * }
 *
 * @param {DeleteTagParams} paramsObj - session & tag ID
 * @param {string} endpoint - e.g. "delete-tag"
 * @returns {Promise<DeleteTagResult>} status + optional error message
 */
export const deleteTag = async (
  paramsObj: DeleteTagParams,
  endpoint: string
): Promise<DeleteTagResult> => {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, error };
    }

    return { status: response.status };
  } catch (err: any) {
    return { status: 0, error: err.message || "Unknown error" };
  }
};
