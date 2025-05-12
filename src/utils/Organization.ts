import { Project, OrgMember, OrgRole } from './types'

/**
 * @description Represents an organization within the application.
 * @property {number} [id] - The unique identifier for the organization (optional, e.g., during creation).
 * @property {string} name - The name of the organization.
 * @property {Project[]} [projects] - Optional array of projects belonging to this organization.
 * @property {OrgMember[]} [members] - Optional array of members in this organization.
 * @property {OrgRole[]} [roles] - Optional array of roles defined within this organization.
 */
export type Organization = {
  /** The unique identifier (may be missing when you’re creating a new org) */
  id?: number;

  /** Human-readable name */
  name: string;

  /** Populated by getOrg — all projects belonging to this org */
  projects?: Project[];

  /** Populated by getOrg — all user memberships in this org */
  members?: OrgMember[];

  /** Any custom roles defined for this org (e.g. Admin, Editor, Viewer) */
  roles?: OrgRole[];
};