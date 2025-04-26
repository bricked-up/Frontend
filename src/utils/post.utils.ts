import { Issue } from "./types";
import { Organization } from "./types";
import { Project } from "./types";
import { API_BASE } from "../config";

/** Params for creating an issue */
export interface IssueParams {
  name: string;
  description?: string | null;
  priority: number;
  cost?: number;
}
/** Result of fetchNewIssue, with possible error message */
export interface Result {
  status: number;
  issue: Issue | null;
  error?: string;
}

/** Params for creating an organization */
export interface NewOrganizationParams {
  name: string;
  projects?: string[];
}
/** Result of createOrganization, with possible error message */
export interface CreateOrganizationResult {
  status: number;
  organization: Organization | null;
  error?: string;
}

/** Params for creating a project */
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
/** Result of createProject, with possible error message */
export interface CreateProjectResult {
  status: number;
  project: Project | null;
  error?: string;
}

/**
 * Try to extract an error message from the response body.
 * Falls back to text or statusText if JSON parsing fails.
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
 * Creates a new issue on the server when the user submits an issue form.
 * Returns the HTTP status, the created Issue (if 2xx), and an error message (if any).
 *
 * Usage:
 * ```ts
 * const { status, issue, error } = await fetchNewIssue(
 *   { name: "Bug #123", description: "Crash on load", priority: 1, cost: 0 },
 *   "issues"
 * );
 * if (issue) { /* success *\/ }
 * else       { console.error(`Error ${status}: ${error}`); }
 * ```
 */
export const fetchNewIssue = async (
  paramsObj: IssueParams,
  endpoint: string
): Promise<Result> => {
  try {
    const params = new URLSearchParams();
    params.append("name", paramsObj.name);
    if (paramsObj.description != null) {
      params.append("description", paramsObj.description);
    }
    params.append("priority", paramsObj.priority.toString());
    params.append("cost", (paramsObj.cost ?? 0).toString());

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errMsg = await parseErrorResponse(response);
      return { status: response.status, issue: null, error: errMsg };
    }

    const raw = (await response.json()) as {
      id: number;
      name: string;
      description?: string | null;
      priority: number;
      cost: number;
      created: string;
      completed: string;
    };

    const issue: Issue = {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? null,
      priority: raw.priority,
      cost: raw.cost,
      created: new Date(raw.created),
      completed: new Date(raw.completed),
    };

    return { status: response.status, issue };
  } catch (err: any) {
    // Network error or unexpected exception
    return { status: 0, issue: null, error: err.message || "Unknown error" };
  }
};

/**
 * Creates a new organization, optionally linking existing project IDs.
 * Returns status, the created Organization (if 2xx), and an error message (if any).
 */
export const createOrganization = async (
  paramsObj: NewOrganizationParams,
  endpoint: string
): Promise<CreateOrganizationResult> => {
  try {
    const params = new URLSearchParams();
    params.append("name", paramsObj.name);
    paramsObj.projects?.forEach((proj) => params.append("projects", proj));

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errMsg = await parseErrorResponse(response);
      return { status: response.status, organization: null, error: errMsg };
    }

    const raw = (await response.json()) as {
      id: number;
      name: string;
      projects?: string[];
    };

    const organization: Organization = {
      id: raw.id,
      name: raw.name,
      projects: raw.projects ?? [],
    };

    return { status: response.status, organization };
  } catch (err: any) {
    return { status: 0, organization: null, error: err.message || "Unknown error" };
  }
};

/**
 * Creates a new project within a given organization.
 * Returns status, the created Project (if 2xx), and an error message (if any).
 */
export const createProject = async (
  paramsObj: NewProjectParams,
  endpoint: string
): Promise<CreateProjectResult> => {
  try {
    const params = new URLSearchParams();
    params.append("name", paramsObj.name);
    params.append("orgId", paramsObj.orgId.toString());
    params.append("tag", paramsObj.tag);
    params.append("budget", paramsObj.budget.toString());
    params.append("charter", paramsObj.charter);
    params.append("archived", paramsObj.archived ? "true" : "false");
    paramsObj.members?.forEach((m) => params.append("members", m));
    paramsObj.issues?.forEach((i) => params.append("issues", i));

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errMsg = await parseErrorResponse(response);
      return { status: response.status, project: null, error: errMsg };
    }

    const raw = (await response.json()) as {
      id: number;
      name: string;
      orgId: number;
      tag: string;
      budget: number;
      charter: string;
      archived: boolean;
      members?: string[];
      issues?: string[];
    };

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