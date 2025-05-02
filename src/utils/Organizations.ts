// src/Organizations.ts
import { Organization } from "./Organization";
const STORAGE_KEY = "organizations";

// Load and rehydrate everything
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

function saveOrgs(orgs: Organization[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs));
}

export function getAllOrganizations(): Organization[] {
  return loadOrgs();
}

export function createOrganization(
  name: string,
  description: string,
  members: string[] = [],
  projects: string[] = [],
): Organization {
  const orgs = loadOrgs();
  const newOrg: Organization = {
    id: `${Date.now()}-${Math.random()}`, // or your makeTimestampId()
    name,
    description,
    members,
    projects,
  };
  const updated = [...orgs, newOrg];
  saveOrgs(updated);
  return newOrg;
}

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

export function deleteOrganization(id: string): void {
  const orgs = loadOrgs().filter(o => o.id !== id);
  saveOrgs(orgs);
}