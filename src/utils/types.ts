export type Project = {
  id: number;
  name: string;
  orgId: number;
  budget: number;
  charter: string;
  archived: boolean;
  members?: ProjectMember[];
  issues?: Issue[];
  tags?: Tag[];
}

export type Organization = {
  id?: number;
  name: string;
  projects?: Project[];
  members?: OrgMember[];
  roles?: OrgRole[];
}

export type User = {
  displayName: string;
  id: number;
  email: string;
  name: string;
  password: string; // Note: Typically passwords/hashes are not sent to the client.
  avatar?: string | null;
  verified: boolean;
  verifyId?: number | null;
  organizations?: OrgMember[]; // Or number[] if backend sends IDs
  projects?: ProjectMember[];  // Or number[] if backend sends IDs
  issues?: Issue[];            // Or number[] if backend sends IDs
  sessions?: Session[];
}

export type Issue = {
  id: number;
  title: string;
  desc?: string | null;
  tagId?: number | null;
  priority?: number | null;
  created: Date; // Parsed from string/SQLNullTime
  completed?: Date | null; // Parsed from SQLNullTime
  cost: number;
  dependencies?: Dependency[];
  reminders?: Reminder[];
}

export type OrgMember = {
  id: number;
  userId: number;
  orgId: number;
  roles?: OrgRole[];
}

export type OrgRole = {
  id: number;
  orgId: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
}

export type ProjectMember = {
  id: number;
  userId: number;
  projectId: number;
  roles?: ProjectRole[];
}

export type ProjectRole = {
  id: number;
  projectId: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
}

export type Tag = {
  id: number;
  projectId: number;
  name: string;
  color: string;
}

export type Dependency = {
  id: number;
  issueId: number;
  dependency: number;
}

export type Reminder = {
  id: number;
  issueId: number;
  userId: number;
}

export type Session = {
  id: number;
  userId: number;
  expires: Date;
}

export type VerifyUser = {
  id: number;
  code: number;
  expires: Date;
}

export type ForgotPassword = {
  id: number;
  userId: number;
  code: number;
  expirationDate: Date;
}

// --- Getter Result Types ---

/**
* Generic interface for the result of a getter function.
* Contains the HTTP status, the data payload (or null), and an optional error message.
*/
export interface GetResult<T> {
status: number;
data: T | null;
error?: string;
}

/** Result type for fetching a single User. */
export type GetUserResult = GetResult<User>;

/** Result type for fetching a single Issue. */
export type GetIssueResult = GetResult<Issue>;

/**
* Result type for fetching project members.
* Currently defined as string[] based on the hypothetical endpoint's expectation.
* This might change to GetResult<ProjectMember[]> or GetResult<User[]> if the
* endpoint is implemented to return richer member objects.
*/
export type GetProjectMembersResult = GetResult<string[]>;

/** Result type for fetching an array of Issues for a project. */
export type GetProjectIssuesResult = GetResult<Issue[]>;

/** Result type for fetching an array of Issues for an organization. */
export type GetOrgIssuesResult = GetResult<Issue[]>;

/**
* Optional: If you have a raw structure for Go's sql.NullTime from the backend
* and want a shared type for it before parsing.
* Not strictly necessary if parsing happens immediately within getter functions.
*/
export interface SQLNullTime {
Time: string;
Valid: boolean;
}