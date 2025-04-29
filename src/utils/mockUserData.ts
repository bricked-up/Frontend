import { User } from '../utils/types';

/**
 * Mock user data for development and testing purposes
 */
const mockUsers: User[] = [
  {
    id: 1,
    displayName: "John Doe",
    email: "john.doe@example.com",
    name: "John",
    password: "hashed_password_1", // In a real app, passwords would be hashed and not stored in code
    avatar: "https://i.pravatar.cc/150?img=1",
    verified: true,
    verifyId: null,
    organizations: [
      {
        id: 1,
        userId: 1,
        orgId: 1,
        roles: [
          {
            id: 1,
            orgId: 1,
            name: "Admin",
            canRead: true,
            canWrite: true,
            canExec: true
          }
        ]
      }
    ],
    projects: [
      {
        id: 1,
        userId: 1,
        projectId: 1,
        roles: [
          {
            id: 1,
            projectId: 1,
            name: "Project Manager",
            canRead: true,
            canWrite: true,
            canExec: true
          }
        ]
      }
    ],
    issues: [
      {
        id: 1,
        title: "Fix bug in dashboard",
        desc: "The dashboard charts are not rendering correctly",
        tagId: 1,
        priority: 1,
        created: new Date("2025-01-15T10:00:00"),
        completed: null,
        cost: 5,
        dependencies: [],
        reminders: []
      }
    ],
    sessions: [
      {
        id: 1,
        userId: 1,
        expires: new Date("2025-05-01T00:00:00") 
      }
    ]
  },
  {
    id: 2,
    displayName: "Jane Smith",
    email: "jane.smith@example.com",
    name: "Jane",
    password: "hashed_password_2",
    avatar: "https://i.pravatar.cc/150?img=2",
    verified: true,
    verifyId: null,
    organizations: [
      {
        id: 2,
        userId: 2,
        orgId: 1,
        roles: [
          {
            id: 2,
            orgId: 1,
            name: "Developer",
            canRead: true,
            canWrite: true,
            canExec: false
          }
        ]
      }
    ],
    projects: [
      {
        id: 2,
        userId: 2,
        projectId: 1,
        roles: [
          {
            id: 2,
            projectId: 1,
            name: "Team Member",
            canRead: true,
            canWrite: true,
            canExec: false
          }
        ]
      }
    ],
    issues: [],
    sessions: [
      {
        id: 2,
        userId: 2,
        expires: new Date("2025-05-01T00:00:00")
      }
    ]
  },
  {
    id: 3,
    displayName: "Alex Johnson",
    email: "alex.johnson@example.com",
    name: "Alex",
    password: "hashed_password_3",
    avatar: "https://i.pravatar.cc/150?img=3",
    verified: true,
    verifyId: null,
    organizations: [],
    projects: [],
    issues: [],
    sessions: []
  }
];

export default mockUsers;