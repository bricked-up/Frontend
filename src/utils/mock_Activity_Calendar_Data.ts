// Consolidated mock data for Organizations, Projects, Users (simplified), and Issues

// --- Interfaces based on Go Structs & Requirements ---


// This the mock data passed to both calendar and activity page. This attributes are the same as how it is set for the backend

export interface MockOrganization {
  id: number;
  name: string;
}

export interface MockProject {
  id: number;
  orgId: number; // Link to Organization
  name: string;
  budget?: number; // Optional based on Go struct
  // Add other relevant fields if needed by frontend, e.g., members: number[]
}

export interface MockUser {
  id: number;
  name: string;
  // Add other relevant fields if needed, e.g., email: string
}

export interface MockIssue {
  id: number;          // Unique ID for the issue/task
  projectId: number;   // Link to Project
  name: string;        // Name of the issue/task
  description?: string;
  priority: 1 | 2 | 3; // 1: High, 2: Medium, 3: Low
  deadline: string;    // Due date as string 'YYYY-MM-DD'
  cost?: number;
  // duration?: string; // Example: '2h', '3d' - not used in calendar mapping for now
  assignedMemberId?: number; // Link to User
  // status?: 'Open' | 'In Progress' | 'Done'; // Optional status
}

// --- Mock Data Instances ---

export const mockOrganizations: MockOrganization[] = [
  { id: 101, name: "Marketing Avengers Org" },
  { id: 102, name: "DevOps Ninjas Org" },
  { id: 103, name: "UI Creators Org" },
  { id: 104, name: "Backend Wizards Org" },
];

export const mockProjects: MockProject[] = [
  { id: 201, orgId: 101, name: "Social Launch Campaign" },
  { id: 202, orgId: 102, name: "Infrastructure Overhaul" },
  { id: 203, orgId: 103, name: "Landing Page Revamp" },
  { id: 204, orgId: 104, name: "API Refactoring" },
  { id: 205, orgId: 101, name: "Email Campaign Q2" },
  { id: 206, orgId: 101, name: "Product Launch Strategy" },
];

export const mockUsers: MockUser[] = [
  { id: 301, name: "Alice (Admin)" },
  { id: 302, name: "Bob (PM)" },
  { id: 303, name: "Charlie (Member)" },
  { id: 304, name: "Diana (Member)" },
];

// Renamed from mockActivityData, now represents Issues/Tasks
export const mockIssues: MockIssue[] = [
  // --- Issues for Project 201 (Social Launch Campaign) ---
  {
    id: 1,
    projectId: 201, // Social Launch Campaign
    name: "Design Instagram Teasers",
    deadline: "2025-04-10",
    priority: 1, // High
    assignedMemberId: 303, // Charlie
    description: "Create visually appealing teasers for Instagram.",
    cost: 150
  },
  {
    id: 13,
    projectId: 201, // Social Launch Campaign
    name: "Analyze Campaign Data",
    deadline: "2025-05-11",
    priority: 2, // Medium
    assignedMemberId: 302, // Bob
    description: "Analyze performance data from the ongoing social media campaign and report findings."
  },
  // --- Issues for Project 202 (Infrastructure Overhaul) ---
  {
    id: 2,
    projectId: 202, // Infrastructure Overhaul
    name: "Setup Kubernetes Cluster",
    deadline: "2025-04-12",
    priority: 1, // High
    assignedMemberId: 304, // Diana
    description: "Install and configure a Kubernetes cluster.",
    cost: 500
  },
  {
    id: 6,
    projectId: 202, // Infrastructure Overhaul
    name: "Monitor System Health",
    deadline: "2025-04-22",
    priority: 2, // Medium
    assignedMemberId: 304, // Diana
    description: "Set up monitoring and alerts for system health."
  },
  {
    id: 10,
    projectId: 202, // Infrastructure Overhaul
    name: "Automate Deployment Pipeline",
    deadline: "2025-05-03",
    priority: 2, // Medium
    assignedMemberId: 304, // Diana
    description: "Implement CI/CD best practices for automated deployment."
  },
  {
    id: 14,
    projectId: 202, // Infrastructure Overhaul
    name: "Update Docker Images",
    deadline: "2025-05-13",
    priority: 3, // Low
    assignedMemberId: 304, // Diana
    description: "Update Docker images for all services to latest versions."
  },
  // --- Issues for Project 203 (Landing Page Revamp) ---
  {
    id: 3,
    projectId: 203, // Landing Page Revamp
    name: "Implement Hero Section",
    deadline: "2025-04-15",
    priority: 1, // High
    assignedMemberId: 303, // Charlie
    description: "Develop the main hero section for the new landing page.",
    cost: 200
  },
   {
    id: 7,
    projectId: 203, // Landing Page Revamp
    name: "Test Mobile Responsiveness",
    deadline: "2025-04-25",
    priority: 2, // Medium
    assignedMemberId: 303, // Charlie
    description: "Ensure the landing page displays correctly on all mobile devices."
  },
   {
    id: 11,
    projectId: 203, // Landing Page Revamp
    name: "Refine UI Elements",
    deadline: "2025-05-06",
    priority: 2, // Medium
    assignedMemberId: 303, // Charlie
    description: "Improve visual appeal and usability of UI components."
  },
  {
    id: 15,
    projectId: 203, // Landing Page Revamp
    name: "Conduct User Testing",
    deadline: "2025-05-15",
    priority: 3, // Low
    assignedMemberId: 302, // Bob
    description: "Gather user feedback on the revamped landing page."
  },
  // --- Issues for Project 204 (API Refactoring) ---
   {
    id: 4,
    projectId: 204, // API Refactoring
    name: "Optimize Endpoints",
    deadline: "2025-04-17",
    priority: 1, // High
    assignedMemberId: 304, // Diana
    description: "Improve performance and scalability of key API endpoints.",
    cost: 300
  },
   {
    id: 8,
    projectId: 204, // API Refactoring
    name: "Improve Database Queries",
    deadline: "2025-04-28",
    priority: 2, // Medium
    assignedMemberId: 304, // Diana
    description: "Review and optimize database queries for better performance."
  },
   {
    id: 12,
    projectId: 204, // API Refactoring
    name: "Implement OAuth 2.0 Authentication",
    deadline: "2025-05-09",
    priority: 2, // Medium
    assignedMemberId: 304, // Diana
    description: "Implement secure OAuth 2.0 authentication for the API."
  },
  // --- Issues for Project 205 (Email Campaign Q2) ---
   {
    id: 5,
    projectId: 205, // Email Campaign Q2
    name: "Write Email Copy",
    deadline: "2025-04-20",
    priority: 2, // Medium
    assignedMemberId: 303, // Charlie
    description: "Draft engaging copy for the Q2 email campaign."
  },
  // --- Issues for Project 206 (Product Launch Strategy) ---
   {
    id: 9,
    projectId: 206, // Product Launch Strategy
    name: "Create Press Release",
    deadline: "2025-05-01",
    priority: 1, // High
    assignedMemberId: 302, // Bob
    description: "Draft and finalize the official press release for the product launch.",
    cost: 100
  },
];

// Helper function to get project name (can be expanded for org/user names)
export const getProjectName = (projectId: number): string => {
  return mockProjects.find(p => p.id === projectId)?.name || "Unknown Project";
}