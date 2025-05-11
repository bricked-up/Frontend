/**
 * Module for managing Organization entities in localStorage.
 *
 * Provides functions to load, save, create, update, and delete organizations.
 */
import { Organization } from "../../utils/Organization";

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
    return Array.isArray(parsed)
      ? parsed.map(o => ({
          id: o.id,
          name: o.name,
          description: o.description || "",
          members: Array.isArray(o.members) ? o.members : [],
          projects: Array.isArray(o.projects) ? o.projects : [],
        }))
      : [];
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
 * @export
 * @returns {Organization[]} Array of all Organization objects.
 */
export function getAllOrganizations(): Organization[] {
  return loadOrgs();
}

/**
 * Create a new organization and persist it.
 *
 * @export
 * @param {string} name - Name of the new organization.
 * @param {string} description - Optional description for the organization.
 * @param {string[]} [members=[]] - List of member IDs.
 * @param {string[]} [projects=[]] - List of project IDs.
 * @returns {Organization} The newly created Organization object.
 */
export function createOrganization(
  name: string,
  description: string,
  members: string[] = [],
  projects: string[] = []
): Organization {
  const orgs = loadOrgs();
  const newOrg: Organization = {
    id: `${Date.now()}-${Math.random()}`,
    name,
    description,
    members,
    projects,
  };
  const updated = [...orgs, newOrg];
  saveOrgs(updated);
  return newOrg;
}

/**
 * Update an existing organization identified by its ID.
 *
 * @export
 * @param {string} id - The unique identifier of the organization to update.
 * @param {Partial<Omit<Organization, "id">>} updates - Partial fields to update on the organization.
 * @throws {Error} If no organization with the given ID exists.
 * @returns {Organization} The updated Organization object.
 */
export function updateOrganization(
  id: string,
  updates: Partial<Omit<Organization, "id">>
): Organization {
  const orgs = loadOrgs();
  const idx = orgs.findIndex(o => o.id === id);
  if (idx === -1) throw new Error("Organization not found");
  const updatedOrg = { ...orgs[idx], ...updates };
  orgs[idx] = updatedOrg;
  saveOrgs(orgs);
  return updatedOrg;
}

/**
 * Delete an organization by its ID.
 *
 * @export
 * @param {string} id - The unique identifier of the organization to delete.
 */
export function deleteOrganization(id: string): void {
  const orgs = loadOrgs().filter(o => o.id !== id);
  saveOrgs(orgs);
}
