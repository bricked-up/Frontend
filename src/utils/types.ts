/**
 * @fileoverview Defines the core data structures and type aliases used throughout the application.
 * This includes types for primary entities like Projects, Organizations, Users, and Issues,
 * as well as supporting types for roles, memberships, API call results, and newer entities like Boards and Tasks.
 */

/**
 * @description Represents a project within the application.
 * @property {number} id - The unique identifier for the project.
 * @property {string} name - The name of the project.
 * @property {number} orgId - The ID of the organization this project belongs to.
 * @property {number} budget - The budget allocated to the project.
 * @property {string} charter - A description or charter for the project.
 * @property {boolean} archived - A flag indicating if the project is archived.
 * @property {ProjectMember[]} [members] - Optional array of project members associated with this project.
 * @property {Issue[]} [issues] - Optional array of issues belonging to this project.
 * @property {Tag[]} [tags] - Optional array of tags defined within this project.
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
};

/**
 * @description Represents an organization within the application.
 * @property {number} [id] - The unique identifier for the organization (optional, e.g., during creation).
 * @property {string} name - The name of the organization.
 * @property {Project[]} [projects] - Optional array of projects belonging to this organization.
 * @property {OrgMember[]} [members] - Optional array of members in this organization.
 * @property {OrgRole[]} [roles] - Optional array of roles defined within this organization.
 */

export type Organization = {
  id?: number;
  name: string;
  projects?: Project[];
  members?: OrgMember[];
  roles?: OrgRole[];
};

/**
 * @description Represents a user account in the application.
 * @property {string} displayName - The user's preferred display name.
 * @property {number} id - The unique identifier for the user.
 * @property {string} email - The user's email address, used for login and communication.
 * @property {string} name - The user's full name or given name.
 * @property {string} password - The user's password. Note: This should typically represent the hashed password
 * on the backend and should not be sent to the client in plain text after initial signup/login.
 * @property {string | null} [avatar] - Optional URL or path to the user's avatar image.
 * @property {boolean} verified - Flag indicating if the user's email address has been verified.
 * @property {number | null} [verifyId] - Optional ID related to the verification process.
 * @property {OrgMember[]} [organizations] - Optional array of organization memberships for the user.
 * (Backend might send IDs; frontend type expects full OrgMember objects).
 * @property {ProjectMember[]} [projects] - Optional array of project memberships for the user.
 * (Backend might send IDs; frontend type expects full ProjectMember objects).
 * @property {Issue[]} [issues] - Optional array of issues assigned to or created by the user.
 * (Backend might send IDs; frontend type expects full Issue objects).
 * @property {Session[]} [sessions] - Optional array of active user sessions.
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
};

/**
 * @description Represents an issue or task within a project.
 * @property {number} id - The unique identifier for the issue.
 * @property {string} title - The title or summary of the issue.
 * @property {string | null} [desc] - Optional detailed description of the issue.
 * @property {number | null} [tagId] - Optional ID of an associated tag.
 * @property {number | null} [priority] - Optional priority level of the issue.
 * @property {Date} created - The date and time when the issue was created. (Parsed from backend string/SQLNullTime).
 * @property {Date | null} [completed] - Optional date and time when the issue was completed. (Parsed from backend SQLNullTime).
 * @property {number} cost - The estimated or actual cost associated with resolving the issue.
 * @property {Dependency[]} [dependencies] - Optional array of issue dependencies.
 * @property {Reminder[]} [reminders] - Optional array of reminders set for this issue.
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
  assignedToId?: number;
  assignedToName?: string;
};

/**
 * @description Represents the membership of a user within an organization, linking a user to an organization.
 * @property {number} id - The unique identifier for the organization membership entry.
 * @property {number} userId - The ID of the user.
 * @property {number} orgId - The ID of the organization.
 * @property {OrgRole[]} [roles] - Optional array of roles assigned to the user within this organization.
 */
export type OrgMember = {
  id: number;
  userId: number;
  orgId: number;
  roles?: OrgRole[];
};

/**
 * @description Defines a role within an organization, specifying permissions.
 * @property {number} id - The unique identifier for the role.
 * @property {number} orgId - The ID of the organization to which this role belongs.
 * @property {string} name - The name of the role (e.g., "Admin", "Editor", "Viewer").
 * @property {boolean} canRead - Permission to read data within the organization.
 * @property {boolean} canWrite - Permission to write or modify data within the organization.
 * @property {boolean} canExec - Permission to execute actions or operations within the organization.
 */
export type OrgRole = {
  id: number;
  orgId: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
};

/**
 * @description Represents the membership of a user within a project, linking a user to a project.
 * @property {number} id - The unique identifier for the project membership entry.
 * @property {number} userId - The ID of the user.
 * @property {number} projectId - The ID of the project.
 * @property {ProjectRole[]} [roles] - Optional array of roles assigned to the user within this project.
 */
export type ProjectMember = {
  id: number;
  userId: number;
  projectId: number;
  roles?: ProjectRole[];
};

/**
 * @description Defines a role within a project, specifying permissions specific to that project.
 * @property {number} id - The unique identifier for the project role.
 * @property {number} projectId - The ID of the project to which this role belongs.
 * @property {string} name - The name of the role (e.g., "Lead", "Developer", "Tester").
 * @property {boolean} canRead - Permission to read data within the project.
 * @property {boolean} canWrite - Permission to write or modify data within the project.
 * @property {boolean} canExec - Permission to execute actions or operations within the project.
 */
export type ProjectRole = {
  id: number;
  projectId: number;
  name: string;
  canRead: boolean;
  canWrite: boolean;
  canExec: boolean;
};

/**
 * @description Represents a tag that can be applied to issues within a project.
 * @property {number} id - The unique identifier for the tag.
 * @property {number} projectId - The ID of the project to which this tag belongs.
 * @property {string} name - The name or label of the tag.
 * @property {string} color - A color code (e.g., hex) associated with the tag for visual identification.
 */
export type Tag = {
  id: number;
  projectId: number;
  name: string;
  color: string;
};

/**
 * @description Represents a dependency relationship between two issues.
 * @property {number} id - The unique identifier for the dependency entry.
 * @property {number} issueId - The ID of the issue that has a dependency.
 * @property {number} dependency - The ID of the issue that `issueId` depends on.
 */
export type Dependency = {
  id: number;
  issueId: number;
  dependency: number;
};

/**
 * @description Represents a reminder associated with an issue for a specific user.
 * @property {number} id - The unique identifier for the reminder.
 * @property {number} issueId - The ID of the issue the reminder is for.
 * @property {number} userId - The ID of the user who should receive the reminder.
 */
export type Reminder = {
  id: number;
  issueId: number;
  userId: number;
};

/**
 * @description Represents an active user session.
 * @property {number} id - The unique identifier for the session.
 * @property {number} userId - The ID of the user to whom this session belongs.
 * @property {Date} expires - The date and time when the session expires.
 */
export type Session = {
  id: number;
  userId: number;
  expires: Date;
};

/**
 * @description Represents a record used for user email verification.
 * @property {number} id - The unique identifier for the verification record.
 * @property {number} code - The verification code sent to the user.
 * @property {Date} expires - The date and time when the verification code expires.
 */
export type VerifyUser = {
  id: number;
  code: number;
  expires: Date;
};

/**
 * @description Represents a record used for the password reset process.
 * @property {number} id - The unique identifier for the password reset record.
 * @property {number} userId - The ID of the user requesting the password reset.
 * @property {number} code - The reset code sent to the user.
 * @property {Date} expirationDate - The date and time when the reset code expires.
 */
export type ForgotPassword = {
  id: number;
  userId: number;
  code: number;
  expirationDate: Date;
};

/**
 * @description Represents a board, which can contain multiple tasks.
 * @property {number} id - The unique identifier for the board.
 * @property {string} name - The name of the board.
 * @property {string} createdBy - The name or identifier of the user who created the board.
 * @property {string} createdById - The ID of the user who created the board.
 * @property {Date} createdAt - The date and time when the board was created.
 * @property {Task[]} tasks - An array of tasks belonging to this board.
 */
export interface Board {
  id: number;
  name: string;
  createdBy: string;
  createdById: string;
  createdAt: Date;
  issues: Issue[];
}

/**
 * @description Represents a task within a board.
 * @property {string} id - The unique identifier for the task (note: type is string).
 * @property {string} title - The title of the task.
 * @property {string} desc - A description of the task.
 * @property {number} tagid - The ID of an associated tag (note: lowercase 'i' in 'tagid').
 * @property {number} priority - The priority level of the task.
 * @property {number} cost - The estimated or actual cost associated with the task.
 * @property {Date} created - The date and time when the task was created.
 * @property {string} createdBy - The name or identifier of the user who created the task.
 * @property {Date} [completed] - Optional date and time when the task was completed.
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
 * Typically used in POST requests.
 * @property {string} name - The name for the new board.
 * @property {string} createdBy - The name or identifier of the user creating the board.
 * @property {Date} createdAt - The creation date for the new board.
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
 * @description Generic interface for the result of a getter function.
 * Contains the HTTP status, the data payload (or null), and an optional error message.
 * @property {number} status - The HTTP status code of the response (or a client-side error code, e.g., 0).
 * @property {T | null} data - The data payload of type T if the request was successful, otherwise null.
 * @property {string} [error] - An optional error message if the request failed or an error occurred.
 */
export interface GetResult<T> {
  status: number;
  data: T | null;
  error?: string;
}

/**
 * @description Result type for fetching a single User.
 * Wraps the User type within the generic GetResult structure.
 */
export type GetUserResult = GetResult<User>;

/**
 * @description Result type for fetching a single Issue.
 * Wraps the Issue type within the generic GetResult structure.
 */
export type GetIssueResult = GetResult<Issue>;

/**
 * @description Result type for fetching project members.
 * Currently defined as `string[]` based on the hypothetical endpoint's expectation.
 * This might change to `GetResult<ProjectMember[]>` or `GetResult<User[]>` if the
 * endpoint is implemented to return richer member objects.
 */
export type GetProjectMembersResult = GetResult<string[]>;

/**
 * @description Result type for fetching an array of Issues for a project.
 * Wraps an array of Issue types within the generic GetResult structure.
 */
export type GetProjectIssuesResult = GetResult<Issue[]>;

/**
 * @description Result type for fetching an array of Issues for an organization.
 * Wraps an array of Issue types within the generic GetResult structure.
 */
export type GetOrgIssuesResult = GetResult<Issue[]>;

/**
 * @interface SQLNullTime
 * @description Represents the raw structure of a nullable time value often returned
 * by Go backends when using `sql.NullTime`. This interface is useful for parsing
 * such data before converting it to a JavaScript `Date` object or `null`.
 * @property {string} Time - The time value as a string (typically ISO 8601 format if Valid is true).
 * @property {boolean} Valid - A boolean indicating whether the Time value is valid (true) or represents a SQL NULL (false).
 */
export interface SQLNullTime {
  Time: string;
  Valid: boolean;
}

// --- New Getter Result Types for Board and Task ---

/**
 * @description Result type for fetching a single Board.
 * Wraps the Board type within the generic GetResult structure.
 */
export type GetBoardResult = GetResult<Board>;

/**
 * @description Result type for fetching multiple Boards.
 * Wraps an array of Board types within the generic GetResult structure.
 */
export type GetBoardsResult = GetResult<Board[]>;

/**
 * @description Result type for fetching a single Task.
 * Wraps the Task type within the generic GetResult structure.
 */
export type GetTaskResult = GetResult<Task>;

/**
 * @description Result type for fetching multiple Tasks.
 * Wraps an array of Task types within the generic GetResult structure.
 */
export type GetTasksResult = GetResult<Task[]>;

export interface Member {
  id: number;
  name: string;
}
