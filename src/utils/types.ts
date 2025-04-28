export type Project = {
    id: number,
    name: string,
    orgId: number,
    tag: string,
    budget: number,
    charter: string,
    archived: boolean,
    members?: string[],
    issues?: string[]
}

export type Organization = {
    id?: number,
    name: string,
    projects?: string[]
}

/**
 * User is the way we will model users for the profile page. 
 * All of the data will be fetched by the db based apart from the email. 
 * When the user successfully logs in a new instance should be created 
 */
export type User = {
    email: string,
    displayName: string,
    password: string,
    avatar?: string | null,
    verified: boolean,
    verifyId?: number | null,
    organizations?: string[],
    projects?: string[],
    issues?: string[]
}

export type Issue = {
    id: number,
    name: string,
    description?: string | null,
    priority: number,
    created: Date,
    completed: Date
    cost: number | 0
}

// Type definitions (Task, Board, etc.) used in CreateIssue components

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
  