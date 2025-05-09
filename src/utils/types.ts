/**
 * @fileoverview Defines the core data structures and type aliases used throughout the application.
 * This includes types for primary entities like Projects, Organizations, Users, and Issues,
 * as well as supporting types for roles, memberships, API call results, and newer entities like Boards and Tasks.
 */

/**
 * @description Represents a project within the application.
 */
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

/**
 * @description Represents an organization within the application.
 */
export type Organization = {
  id?: number;
  name: string;
  projects?: Project[];
  members?: OrgMember[];
}

/**
 * @description Raw variant of Organization with project IDs only.
 */
export type RawOrganization = Omit<Organization, "projects"> & {
  projects?: string[];
}

/**
 * @description Represents a user account in the application.
 */
export type User = {
  displayName: string;
  id: number;
  email: string;
  name: string;
  password: string;
  avatar?: string | null;
  verified: boolean;
  verifyId?: number | null;
  organizations?: OrgMember[];
  projects?: ProjectMember[];
  issues?: Issue[];
  sessions?: Session[];
  role?: string;
}

/**
 * @description Represents an issue or task within a project.
 */
export type Issue = {
  id: number;
  title: string;
  desc?: string | null;
  tagId?: number | null;
  priority?: number | null;
  created: Date;
  completed?: Date | null;
  cost: number;
  dependencies?: Dependency[];
  reminders?: Reminder[];
}

/**
 * @description Represents the membership of a user within an organization.
 */
export type OrgMember = {
  id: number;
  userId: number;
  orgId: number;
  roles?: OrgRole[];
}

/**
 * @description Defines a role within an organization.
 */
export type OrgRole = {
  id: number;
  orgId: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
}

/**
 * @description Represents the membership of a user within a project.
 */
export type ProjectMember = {
  id: number;
  userId: number;
  projectId: number;
  roles?: ProjectRole[];
}

/**
 * @description Defines a role within a project.
 */
export type ProjectRole = {
  id: number;
  projectId: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
}

/**
 * @description Represents a tag that can be applied to issues within a project.
 */
export type Tag = {
  id: number;
  projectId: number;
  name: string;
  color: string;
}

/**
 * @description Represents a dependency relationship between two issues.
 */
export type Dependency = {
  id: number;
  issueId: number;
  dependency: number;
}

/**
 * @description Represents a reminder associated with an issue for a specific user.
 */
export type Reminder = {
  id: number;
  issueId: number;
  userId: number;
}

/**
 * @description Represents an active user session.
 */
export type Session = {
  id: number;
  userId: number;
  expires: Date;
}

/**
 * @description Represents a record used for user email verification.
 */
export type VerifyUser = {
  id: number;
  code: number;
  expires: Date;
}

/**
 * @description Represents a record used for the password reset process.
 */
export type ForgotPassword = {
  id: number;
  userId: number;
  code: number;
  expirationDate: Date;
}

/**
 * @description Represents a board, which can contain multiple tasks.
 */
export interface Board {
  id: number;
  name: string;
  createdBy: string;
  createdById: string;
  createdAt: Date;
  tasks: Task[];
}

/**
 * @description Represents a task within a board.
 */
export interface Task {
  id: string;
  title: string;
  desc: string;
  tagid: number;
  priority: number;
  cost: number;
  created: Date;
  createdBy: string;
  completed?: Date;
}

/**
 * @description Represents the data structure for creating a new board.
 */
export interface NewBoard {
  name: string;
  createdBy: string;
  createdAt: Date;
}

// --- Getter Result Types ---

/**
 * @interface GetResult
 * @template T The type of the data payload.
 */
export interface GetResult<T> {
  status: number;
  data: T | null;
  error?: string;
}

/**
 * @description Result type for fetching a single User.
 */
export type GetUserResult = GetResult<User>;

/**
 * @description Result type for fetching a single Issue.
 */
export type GetIssueResult = GetResult<Issue>;

/**
 * @description Result type for fetching project members.
 */
export type GetProjectMembersResult = GetResult<string[]>;

/**
 * @description Result type for fetching an array of Issues for a project.
 */
export type GetProjectIssuesResult = GetResult<Issue[]>;

/**
 * @description Result type for fetching an array of Issues for an organization.
 */
export type GetOrgIssuesResult = GetResult<Issue[]>;

/**
 * @interface SQLNullTime
 * @description Represents the raw structure of a nullable time value.
 */
export interface SQLNullTime {
  Time: string;
  Valid: boolean;
}

// --- New Getter Result Types for Board and Task ---

/**
 * @description Result type for fetching a single Board.
 */
export type GetBoardResult = GetResult<Board>;

/**
 * @description Result type for fetching multiple Boards.
 */
export type GetBoardsResult = GetResult<Board[]>;

/**
 * @description Result type for fetching a single Task.
 */
export type GetTaskResult = GetResult<Task>;

/**
 * @description Result type for fetching multiple Tasks.
 */
export type GetTasksResult = GetResult<Task[]>;

