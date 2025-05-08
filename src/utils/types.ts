// src/utils/types.ts

// --- Helper Type for Backend's sql.NullTime ---
// Add this type definition
export interface SQLNullTime {
  Time: string; // The timestamp string (e.g., "2023-01-01T10:00:00Z" or "0001-01-01T00:00:00Z")
  Valid: boolean; // True if the time is valid (not NULL in SQL), false otherwise
}

// --- Main Entity Types (Corrected) ---

export type User = {
  id: number;
  email: string;
  name: string; // Backend sends 'name', not 'displayName'. Remove displayName or map it if needed elsewhere.
  password?: string; // Backend /get-user sends this (empty string). Make optional or handle.
  avatar?: string | null;
  verified: boolean;
  // verifyId is NOT sent by /get-user endpoint
  organizations: number[]; // Backend /get-user sends array of Org IDs (numbers)
  projects: number[]; // Backend /get-user sends array of Project IDs (numbers)
  issues: number[]; // Backend /get-user sends array of Issue IDs (numbers)
  // sessions are likely not part of the /get-user response
};

export type Issue = {
  id: number;
  title: string; // Backend sends 'title'
  desc: string; // Backend sends 'desc'. Ensure backend doesn't send null if type is string. Use `string | null` if it can be null.
  tagid: number | null; // Backend sends 'tagid' (lowercase). Use `number | null` if it can be null.
  priority: number | null; // Backend sends 'priority'. Use `number | null` if it can be null.
  created: string; // Backend sends as string "YYYY-MM-DDTHH:MM:SSZ". Parsing to Date should happen in getter or component.
  completed: SQLNullTime; // Backend sends this structure for sql.NullTime
  cost: number;
  dependencies: number[] | null; // Backend sends array of Issue IDs (numbers) or null.
  // reminders are NOT sent by /get-issue endpoint
};

// --- Other Types (Keep as is if not directly related to getter issues) ---
// Ensure Project, Organization, OrgMember, etc. are correct if used elsewhere

export type Project = {
  id: number;
  name: string;
  orgid: number; // Ensure case matches backend if fetched directly (orgId vs orgid)
  budget: number;
  charter: string;
  archived: boolean;
  members?: number[]; // Often backend sends IDs, not full objects
  issues?: number[]; // Often backend sends IDs, not full objects
  tags?: number[]; // Often backend sends IDs, not full objects
};

export type Organization = {
  id?: number;
  name: string;
  projects?: number[]; // Often backend sends IDs
  members?: number[]; // Often backend sends IDs
  roles?: number[]; // Often backend sends IDs
};

// ... (Keep other types like OrgMember, OrgRole, etc. Review them similarly if needed)

export type Tag = {
  id: number;
  projectid: number; // Ensure case matches backend
  name: string;
  color: string;
};

// --- Getter Result Types (These look correct based on your previous file) ---

export interface GetResult<T> {
  status: number;
  data: T | null;
  error?: string;
}

export type GetUserResult = GetResult<User>;
export type GetIssueResult = GetResult<Issue>;
export type GetProjectMembersResult = GetResult<string[]>; // Keep as string[] if backend /proj-members (if implemented) sends strings. Or number[] if it sends numbers.
export type GetProjectIssuesResult = GetResult<Issue[]>; // If backend sends array of full Issue objects
export type GetOrgIssuesResult = GetResult<Issue[]>; // If backend sends array of full Issue objects