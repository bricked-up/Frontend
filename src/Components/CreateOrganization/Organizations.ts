/**
 * Module for managing Organization entities in localStorage.
 *
 * Provides functions to load, save, create, update, and delete organizations.
 */

import { Organization, Project, OrgMember, OrgRole } from "../../utils/types";

const STORAGE_KEY = "organizations";

/**
 * Load and rehydrate all stored organizations from localStorage.
 *
 * @returns {Organization[]} Array of Organization objects, or an empty array if none are stored or on parse error.
 */
function loadOrgs(): Organization[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((o: any) => ({
      id: typeof o.id === "number" ? o.id : undefined,
      name: String(o.name),
      projects: Array.isArray(o.projects) ? (o.projects as Project[]) : [],
      members: Array.isArray(o.members) ? (o.members as OrgMember[]) : [],
      roles: Array.isArray(o.roles) ? (o.roles as OrgRole[]) : [],
    }));
  } catch {
    return [];
  }
}

/**
 * Serialize and save the given organizations array to localStorage.
 *
 * @param {Organization[]} orgs - Array of organizations to persist.
 */
function saveOrgs(orgs: Organization[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs));
}

/**
 * Retrieve all stored organizations.
 *
 * @returns {Organization[]} Array of all Organization objects.
 */
export function getAllOrganizations(): Organization[] {
  return loadOrgs();
}

/**
 * Create a new organization and persist it.
 *
 * @param {string} name - Name of the new organization.
 * @param {Project[]} [projects] - Optional initial list of projects.
 * @param {OrgMember[]} [members] - Optional initial list of members.
 * @param {OrgRole[]} [roles] - Optional initial list of roles.
 * @returns {Organization} The newly created Organization object.
 */
export function createOrganization(
  name: string,
  projects: Project[] = [],
  members: OrgMember[] = [],
  roles: OrgRole[] = []
): Organization {
  const orgs = loadOrgs();

  // Generate a numeric ID; in a real app you might want a better ID strategy
  const nextId = orgs.length
    ? Math.max(...orgs.map((o) => o.id ?? 0)) + 1
    : 1;

  const newOrg: Organization = {
    id: nextId,
    name,
    projects,
    members,
    roles,
  };

  const updated = [...orgs, newOrg];
  saveOrgs(updated);

  return newOrg;
}

/**
 * Update an existing organization identified by its ID.
 *
 * @param {number} id - The unique identifier of the organization to update.
 * @param {Partial<Omit<Organization, "id">>} updates - Partial fields to update on the organization.
 * @throws {Error} If no organization with the given ID exists.
 * @returns {Organization} The updated Organization object.
 */
export function updateOrganization(
  id: number,
  updates: Partial<Omit<Organization, "id">>
): Organization {
  const orgs = loadOrgs();
  const idx = orgs.findIndex((o) => o.id === id);

  if (idx === -1) {
    throw new Error(`Organization with id=${id} not found`);
  }

  const updatedOrg: Organization = {
    ...orgs[idx],
    ...updates,
    id, // ensure we never overwrite the id
  };

  orgs[idx] = updatedOrg;
  saveOrgs(orgs);
  return updatedOrg;
}

/**
 * Delete an organization by its ID.
 *
 * @param {number} id - The unique identifier of the organization to delete.
 */
export function deleteOrganization(id: number): void {
  const orgs = loadOrgs().filter((o) => o.id !== id);
  saveOrgs(orgs);
}