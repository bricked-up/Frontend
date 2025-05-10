/**
 * Module for seeding and managing Organization entities in localStorage.
 *
 * Provides functions to retrieve, add, update, and delete organizations,
 * with default organizations seeded when none exist.
 */
import { Organization } from './Organization';

/**
 * Storage key used for persisting organizations in localStorage.
 * @constant {string}
 */
const STORAGE_KEY = 'organizations';

/**
 * Default set of organizations to seed into localStorage if none exist.
 * @constant {Organization[]}
 */
const defaultOrgs: Organization[] = [
  { id: 1, name: 'Bricked-Up', members: [], projects: [] },
  { id: 2, name: 'George King IT',  members: [], projects: [] },
  { id: 3, name: 'SAP', members: [], projects: [] },
];

/**
 * Retrieve and parse a JSON value from localStorage.
 *
 * @param {string} key - The storage key to read from.
 * @returns {any[] | null} The parsed array if valid JSON, otherwise null.
 */
const getFromStore = (key: string): any[] | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Serialize and save a value to localStorage under the specified key.
 *
 * @param {string} key - The storage key to write to.
 * @param {any} data - The data to serialize and store.
 */
const updateStore = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Retrieves organizations from localStorage, seeding defaults if none are found.
 *
 * @export
 * @returns {Organization[]} Array of Organization objects from storage.
 */
export const getOrganizationsFromStore = (): Organization[] => {
  const stored = getFromStore(STORAGE_KEY);
  if (!Array.isArray(stored) || stored.length === 0) {
    updateStore(STORAGE_KEY, defaultOrgs);
    return defaultOrgs;
  }
  return stored.map(o => ({
    id: o.id,
    name: o.name,
    description: o.description || '',
    members: Array.isArray(o.members) ? o.members : [],
    projects: Array.isArray(o.projects) ? o.projects : [],
  }));
};

/**
 * Adds a new organization to localStorage.
 *
 * @export
 * @param {Organization} org - The organization to add.
 * @returns {boolean} True if the operation succeeds.
 */
export const addOrganizationToStore = (org: Organization): boolean => {
  const orgs = getOrganizationsFromStore();
  const updated = [...orgs, org];
  updateStore(STORAGE_KEY, updated);
  return true;
};

/**
 * Updates an existing organization in localStorage by matching its ID.
 *
 * @export
 * @param {Organization} updatedOrg - The organization object with updated fields.
 * @returns {boolean} True if the organization was found and updated, false otherwise.
 */
export const updateStoreOrganization = (updatedOrg: Organization): boolean => {
  const orgs = getOrganizationsFromStore();
  const idx = orgs.findIndex(o => o.id === updatedOrg.id);
  if (idx === -1) return false;
  orgs[idx] = updatedOrg;
  updateStore(STORAGE_KEY, orgs);
  return true;
};

/**
 * Deletes an organization from localStorage by its ID.
 *
 * @export
 * @param {string} id - The unique identifier of the organization to remove.
 * @returns {boolean} True if the operation succeeds.
 */
export const deleteOrganizationFromStore = (id: number): boolean => {
  const orgs = getOrganizationsFromStore().filter(o => o.id !== id);
  updateStore(STORAGE_KEY, orgs);
  return true;
};
