export type Project = {
  id: number;
  name: string;
  orgId: number;
  tag: string;
  budget: number;
  charter: string;
  archived: boolean;
  members?: string[];
  issues?: string[];
};

export type rawProject = Omit<Project, "members" | "issues"> & {
  members?: string[];
  issues?: string[];
};

export type Organization = {
  id?: number;
  name: string;
  projects?: string[];
};

export type RawOrganization = Omit<Organization, "projects"> & {
  projects?: string[];
};

/**
 * User is the way we will model users for the profile page.
 * All of the data will be fetched by the db based apart from the email.
 * When the user successfully logs in a new instance should be created
 */
export type User = {
  email: string;
  displayName: string;
  password: string;
  avatar?: string | null;
  verified: boolean;
  verifyId?: number | null;
  organizations?: string[];
  projects?: string[];
  issues?: string[];
  role: string;  
};

export type Issue = {
  id: number;
  name: string;
  description?: string | null;
  priority: number;
  created: Date;
  completed: Date;
  cost: number | 0;
};

export type RawIssue = Omit<Issue, "created" | "completed"> & {
  created: string;
  completed: string;
};
