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
    password: string;
    avatar?: string | null;
    verified: boolean;
    verifyId?: number | null;
    organizations?: OrgMember[];
    projects?: ProjectMember[];
    issues?: Issue[];
    sessions?: Session[];
  }
  
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
  
  export interface Board {
    id: number;
    name: string;
    createdBy: string;
    createdById: string;
    createdAt: Date;
    tasks: Task[];
  }
  
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
  
  
  export interface NewBoard {
    name: string;
    createdBy: string;
    createdAt: Date;
  }
  
  