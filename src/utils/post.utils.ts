import {
  Issue,
  RawIssue,
  Organization,
  RawOrganization,
  Project,
  rawProject,
} from "./types";
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

    const raw = (await response.json()) as RawIssue;
    const issue: Issue = {
      ...raw,
      created: new Date(raw.created),
      completed: new Date(raw.completed),
    };

    return { status: response.status, issue };
  } catch (err: any) {
    return { status: 0, issue: null, error: err.message || "Unknown error" };
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

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return { status: response.status, organization: null, error };
    }

    const raw = (await response.json()) as RawOrganization;
    const organization: Organization = {
      id: raw.id,
      name: raw.name,
      projects: raw.projects ?? [],
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

    const raw = (await response.json()) as rawProject;
    const project: Project = {
      id: raw.id,
      name: raw.name,
      orgId: raw.orgId,
      tag: raw.tag,
      budget: raw.budget,
      charter: raw.charter,
      archived: raw.archived,
      members: raw.members ?? [],
      issues: raw.issues ?? [],
    };

    return { status: response.status, project };
  } catch (err: any) {
    return { status: 0, project: null, error: err.message || "Unknown error" };
  }
};