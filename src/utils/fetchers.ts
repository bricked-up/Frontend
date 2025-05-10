/* src/utils/fetchers.ts */
import { API_BASE } from "../config";
import {
  Issue,
  Organization,
  Project,
  GetOrganizationResult,
  GetResult,
  GetUserResult,
  GetOrgMemberResult,
  GetProjectResult,
  GetProjectMemberResult,
  
} from "./types";
import {
  getUser,
  getOrg,
  
  
} from "./getters.utils";
import {

  NewOrganizationParams,
  CreateOrganizationResult,
  NewProjectParams,
  CreateProjectResult,
} from "./post.utils"
/**
 * Helper: parse error from non-OK fetch responses
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
 * Fetch all organizations for a given user by loading their org IDs then each org
 */
export async function fetchAllOrgsForUser(userId: number): Promise<Organization[]> {
  const { data: user, error: userErr }: GetUserResult = await getUser(userId);
  if (userErr || !user) {
    console.error("🛰️ fetchAllOrgsForUser: could not load user:", userErr);
    return [];
  }
  const orgIds = Array.isArray(user.organizations) ? (user.organizations as number[]) : [];
  const orgs = await Promise.all(
    orgIds.map(async id => {
      const { data, error }: GetOrganizationResult = await getOrg(id);
      if (error || !data) {
        console.warn(`🛰️ fetchAllOrgsForUser: failed to load org ${id}`, error);
        return null;
      }
      return data;
    })
  );
  return orgs.filter((o): o is Organization => o !== null);
}

/**
 * Create a new issue
 */
export async function createNewIssue(
  paramsObj: { name: string; description?: string | null; priority: number; cost?: number },
  endpoint: string
): Promise<GetResult<Issue>> {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value != null) params.append(key, String(value));
    });
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await parseErrorResponse(res);
      return { status: res.status, data: null, error: err };
    }
    const rawJson: any = await res.json();
    const issue: Issue = {
      id: rawJson.id,
      title: rawJson.title,
      desc: rawJson.desc ?? null,
      tagId: rawJson.tagId ?? null,
      priority: rawJson.priority ?? null,
      cost: rawJson.cost,
      created: new Date(rawJson.created),
      completed: rawJson.completed ? new Date(rawJson.completed) : null,
      dependencies: rawJson.dependencies ?? [],
      reminders: rawJson.reminders ?? [],
    };
    return { status: res.status, data: issue };
  } catch (err: any) {
    return { status: 0, data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Create a new organization via backend
 */
export async function createOrganization(
  paramsObj: NewOrganizationParams,
  endpoint: string
): Promise<CreateOrganizationResult> {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    });
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await parseErrorResponse(res);
      return { status: res.status, organization: null, error: err };
    }
    const rawJson: any = await res.json();
    const organization: Organization = {
      id: rawJson.id,
      name: rawJson.name,
      projects: rawJson.projects ?? [],
      members: rawJson.members ?? [],
      roles: rawJson.roles ?? [],
    };
    return { status: res.status, organization };
  } catch (err: any) {
    return { status: 0, organization: null, error: err.message || "Unknown error" };
  }
}

/**
 * Delete an organization via backend
 */
export async function deleteOrganization(
  orgId: number,
  endpoint: string
): Promise<{ status: number; error?: string }> {
  try {
    const params = new URLSearchParams();
    params.append("orgid", String(orgId));
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await parseErrorResponse(res);
      return { status: res.status, error: err };
    }
    return { status: res.status };
  } catch (err: any) {
    return { status: 0, error: err.message || "Unknown error" };
  }
}

/**
 * Create a new project via backend
 */
export async function createProject(
  paramsObj: NewProjectParams,
  endpoint: string
): Promise<CreateProjectResult> {
  try {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    });
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await parseErrorResponse(res);
      return { status: res.status, project: null, error: err };
    }
    const rawJson: any = await res.json();
    const project: Project = {
      id: rawJson.id,
      name: rawJson.name,
      orgId: rawJson.orgId,
      budget: rawJson.budget,
      charter: rawJson.charter,
      archived: rawJson.archived,
      members: rawJson.members ?? [],
      issues: rawJson.issues ?? [],
      tags: rawJson.tags ?? [],
    };
    return { status: res.status, project };
  } catch (err: any) {
    return { status: 0, project: null, error: err.message || "Unknown error" };
  }
}
