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
  