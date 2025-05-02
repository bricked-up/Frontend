import { Organization } from './Organization';

const STORAGE_KEY = 'organizations';

// Default organizations seeded when none exist in localStorage
const defaultOrgs: Organization[] = [
  { id: '1', name: 'Bricked-Up', description: '', members: [], projects: [] },
  { id: '2', name: 'George King IT', description: '', members: [], projects: [] },
  { id: '3', name: 'SAP', description: '', members: [], projects: [] },
];

const getFromStore = (key: string): any[] | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const updateStore = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Retrieves organizations from localStorage, seeding defaults if empty.
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
 * Adds a new organization and persists the full list.
 */
export const addOrganizationToStore = (org: Organization): boolean => {
  const orgs = getOrganizationsFromStore();
  const updated = [...orgs, org];
  updateStore(STORAGE_KEY, updated);
  return true;
};

/**
 * Updates an existing organization and persists the full list.
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
 * Deletes an organization by ID and persists the full list.
 */
export const deleteOrganizationFromStore = (id: string): boolean => {
  const orgs = getOrganizationsFromStore().filter(o => o.id !== id);
  updateStore(STORAGE_KEY, orgs);
  return true;
};