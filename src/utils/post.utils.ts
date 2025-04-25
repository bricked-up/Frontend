import { StringDecoder } from "string_decoder";
import { Issue } from "./types";
import { Organization } from "./types";
import { Project } from "./types";

export interface IssueParams {
    name: string;
    description?: string | null;
    priority: number;
    cost?: number;
}

export interface Result {
    status: number;
    issue: Issue | null;
}

export interface NewOrganizationParams {
    name: string;
    projects?: string[];
}
  
export interface CreateOrganizationResult {
    status: number;
    organization: Organization | null;
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
}

/**
 * Creates a new issue on the server when the user submits an issue form.
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
 * const { status, issue } = await fetchNewIssue(
 *   { name: "Bug #123", description: "Crash on load", priority: 1, cost: 0 },
 *   "issues"
 * );
 * if (status === 201 && issue) {
 *   // handle success
 * } else {
 *   console.error(`Failed to create issue: ${status}`);
 * }
 *
 * @param {IssueParams} paramsObj - The data for the new issue
 * @param {string} endpoint - The API endpoint (e.g. "issues")
 * @returns {Promise<Result>} Promise resolving to an object with status and the Issue or null
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

    const response = await fetch(`/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    let rawJson: any = null;
    if (response.ok) {
      rawJson = await response.json();
    }

    if (response.ok && rawJson) {
      const raw = rawJson as {
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
    }
    return { status: response.status, issue: null };
  } catch (error: any) {
    console.error("fetchNewIssue error:", error.message);
    return { status: 500, issue: null };
  }
};

/**
 * Creates a new organization, optionally linking existing project IDs.
 * Call this after the user submits the organization creation form.
 *
 * 201 – Created: organization was successfully created
 * 400 – Bad Request: invalid organization data
 * 401 – Unauthorized: authentication required
 * 403 – Forbidden: insufficient permissions
 * 405 – Method Not Allowed: wrong HTTP method
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const result = await createOrganization(
 *   { name: "Acme Corp", projects: ["proj1", "proj2"] },
 *   "organizations"
 * );
 * if (result.status === 201 && result.organization) {
 *   console.log("Organization created:", result.organization);
 * } else {
 *   console.error(`Error creating organization: ${result.status}`);
 * }
 *
 * @param {NewOrganizationParams} paramsObj - The organization data
 * @param {string} endpoint - The API endpoint (e.g. "organizations")
 * @returns {Promise<CreateOrganizationResult>} Promise resolving to status and the Organization or null
 */
export const createOrganization = async (
  paramsObj: NewOrganizationParams,
  endpoint: string
): Promise<CreateOrganizationResult> => {
  try {
    const params = new URLSearchParams();
    params.append("name", paramsObj.name);
    if (paramsObj.projects) {
      paramsObj.projects.forEach((proj) => params.append("projects", proj));
    }

    const response = await fetch(`/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    let rawJson: any = null;
    if (response.ok) {
      rawJson = await response.json();
    }

    if (response.ok && rawJson) {
      const raw = rawJson as {
        id?: number;
        name: string;
        projects?: string[];
      };

      const organization: Organization = {
        id: raw.id!,
        name: raw.name,
        projects: raw.projects ?? [],
      };

      return { status: response.status, organization };
    }

    return { status: response.status, organization: null };
  } catch (error: any) {
    console.error("createOrganization error:", error.message);
    return { status: 500, organization: null };
  }
};

/**
 * Creates a new project within a given organization.
 * Invoke when the user submits the project creation form.
 *
 * 201 – Created: project was successfully created
 * 400 – Bad Request: invalid project data
 * 401 – Unauthorized: authentication required
 * 403 – Forbidden: insufficient permissions
 * 405 – Method Not Allowed: wrong HTTP method
 * 500 – Internal Server Error: check response body for details
 *
 * @example
 * const result = await createProject(
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
 * if (result.status === 201 && result.project) {
 *   console.log("Project created:", result.project);
 * } else {
 *   console.error(`Error creating project: ${result.status}`);
 * }
 *
 * @param {NewProjectParams} paramsObj - The project data
 * @param {string} endpoint - The API endpoint (e.g. "projects")
 * @returns {Promise<CreateProjectResult>} Promise resolving to status and the Project or null
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
    if (paramsObj.members) {
      paramsObj.members.forEach((m) => params.append("members", m));
    }
    if (paramsObj.issues) {
      paramsObj.issues.forEach((i) => params.append("issues", i));
    }

    const response = await fetch(`/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    let rawJson: any = null;
    if (response.ok) {
      rawJson = await response.json();
    }

    if (response.ok && rawJson) {
      const raw = rawJson as {
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
    }

    return { status: response.status, project: null };
  } catch (error: any) {
    console.error("createProject error:", error.message);
    return { status: 500, project: null };
  }
};