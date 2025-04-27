<<<<<<< HEAD
//This contains data that will be passed to both activity page and calendar page
//PLEASE REMOVE WHEN NEEDED THIS IS FOR VISUALIZATION PURPOSES MEOW MEOW

export interface TaskItem {
  id: string;
  teamName: string;
  projectName: string;
  taskName: string;
  dueDate: string;
  role: string;
  description: string;
}

export const mockActivityData: TaskItem[] = [
{
  id: "1",
  teamName: "Marketing Avengers",
  projectName: "Social Launch",
  taskName: "Design Instagram Teasers",
  dueDate: "2025-04-10",
  role: "Team Manager",
  description: "Oversee the design of a series of Instagram teasers to create visual appeal for the upcoming product launch. Ensure that the branding and tone align with the company's guidelines."
},
{
  id: "2",
  teamName: "DevOps Ninjas",
  projectName: "Infra Overhaul",
  taskName: "Setup Kubernetes Cluster",
  dueDate: "2025-04-12",
  role: "Team Member",
  description: "Install and configure a Kubernetes cluster to manage our infrastructure. Ensure all pods are correctly deployed and the system is fully scalable."
},
{
  id: "3",
  teamName: "UI Creators",
  projectName: "Landing Page Revamp",
  taskName: "Implement Hero Section",
  dueDate: "2025-04-15",
  role: "Project Lead",
  description: "Lead the design and development of the hero section on the landing page. Focus on making it engaging and user-friendly, while adhering to the brand's style guide."
},
{
  id: "4",
  teamName: "Backend Wizards",
  projectName: "API Refactor",
  taskName: "Optimize Endpoints",
  dueDate: "2025-04-17",
  role: "Co-Manager",
  description: "Collaborate with the backend team to optimize the API endpoints for improved performance and scalability. Ensure that all changes are well-documented and thoroughly tested."
},
{
  id: "5",
  teamName: "Marketing Avengers",
  projectName: "Email Campaign",
  taskName: "Write Email Copy",
  dueDate: "2025-04-20",
  role: "Team Member",
  description: "Write persuasive and engaging email copy for an upcoming product email campaign. Make sure the message is aligned with the overall marketing strategy and speaks to the target audience."
},
{
  id: "6",
  teamName: "DevOps Ninjas",
  projectName: "Infra Overhaul",
  taskName: "Monitor System Health",
  dueDate: "2025-04-22",
  role: "Team Member",
  description: "Monitor the health of the system and ensure all servers are operating efficiently. Set up automated alerts for any performance issues and respond to them promptly."
},
{
  id: "7",
  teamName: "UI Creators",
  projectName: "Landing Page Revamp",
  taskName: "Test Mobile Responsiveness",
  dueDate: "2025-04-25",
  role: "Team Member",
  description: "Test the mobile responsiveness of the landing page to ensure it displays correctly on all devices. Fix any layout issues or bugs that arise during testing."
},
{
  id: "8",
  teamName: "Backend Wizards",
  projectName: "API Refactor",
  taskName: "Improve Database Queries",
  dueDate: "2025-04-28",
  role: "Project Lead",
  description: "Review and optimize database queries to improve response time and reduce load on the server. Ensure the changes are scalable and well-documented."
},
{
  id: "9",
  teamName: "Marketing Avengers",
  projectName: "Product Launch",
  taskName: "Create Press Release",
  dueDate: "2025-05-01",
  role: "Team Manager",
  description: "Draft and finalize a press release announcing the product launch. Ensure that it communicates the value of the product clearly and is distributed to relevant media outlets."
},
{
  id: "10",
  teamName: "DevOps Ninjas",
  projectName: "Infra Overhaul",
  taskName: "Automate Deployment Pipeline",
  dueDate: "2025-05-03",
  role: "Co-Manager",
  description: "Work with the team to automate the deployment pipeline for faster and more reliable releases. Implement continuous integration/continuous deployment (CI/CD) best practices."
},
{
  id: "11",
  teamName: "UI Creators",
  projectName: "Landing Page Revamp",
  taskName: "Refine UI Elements",
  dueDate: "2025-05-06",
  role: "Project Lead",
  description: "Lead the team in refining the user interface elements on the landing page. Focus on improving the visual appeal while ensuring ease of navigation for end users."
},
{
  id: "12",
  teamName: "Backend Wizards",
  projectName: "API Refactor",
  taskName: "Implement OAuth 2.0 Authentication",
  dueDate: "2025-05-09",
  role: "Team Member",
  description: "Implement OAuth 2.0 authentication for the API to ensure secure access for third-party integrations. Test and document the new authentication flow."
},
{
  id: "13",
  teamName: "Marketing Avengers",
  projectName: "Social Launch",
  taskName: "Analyze Campaign Data",
  dueDate: "2025-05-11",
  role: "Team Manager",
  description: "Analyze data from the ongoing social media campaign. Prepare a report on the performance and make recommendations for optimization in future campaigns."
},
{
  id: "14",
  teamName: "DevOps Ninjas",
  projectName: "Infra Overhaul",
  taskName: "Update Docker Images",
  dueDate: "2025-05-13",
  role: "Team Member",
  description: "Update the Docker images for all services to ensure they are running the latest versions of dependencies. Test to ensure compatibility with existing systems."
},
{
  id: "15",
  teamName: "UI Creators",
  projectName: "Landing Page Revamp",
  taskName: "Conduct User Testing",
  dueDate: "2025-05-15",
  role: "Team Member",
  description: "Conduct user testing on the new landing page to gather feedback on usability and design. Analyze the results and implement necessary changes based on user feedback."
}
];
=======
// This contains mock data for issues, intended for use in Activity and Calendar pages.
// It uses the Issue type defined in ./types.ts

import { Issue } from "../utils/types"; // Import the Issue type

// Mock data conforming to the Issue type
export const mockActivityData: Issue[] = [
  {
    id: 1, // Changed to number
    name: "Design Instagram Teasers", // Was taskName
    description: "Oversee the design of a series of Instagram teasers to create visual appeal for the upcoming product launch. Ensure that the branding and tone align with the company's guidelines.", // Kept description
    priority: 1, // Added priority (defaulted to 1)
    created: new Date(), // Added created date (defaulted to now)
    completed: new Date("2025-04-10"), // Was dueDate, converted to Date
    cost: 0 // Added cost (defaulted to 0)
  },
  {
    id: 2,
    name: "Setup Kubernetes Cluster",
    description: "Install and configure a Kubernetes cluster to manage our infrastructure. Ensure all pods are correctly deployed and the system is fully scalable.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-12"),
    cost: 0
  },
  {
    id: 3,
    name: "Implement Hero Section",
    description: "Lead the design and development of the hero section on the landing page. Focus on making it engaging and user-friendly, while adhering to the brand's style guide.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-15"),
    cost: 0
  },
  {
    id: 4,
    name: "Optimize Endpoints",
    description: "Collaborate with the backend team to optimize the API endpoints for improved performance and scalability. Ensure that all changes are well-documented and thoroughly tested.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-17"),
    cost: 0
  },
  {
    id: 5,
    name: "Write Email Copy",
    description: "Write persuasive and engaging email copy for an upcoming product email campaign. Make sure the message is aligned with the overall marketing strategy and speaks to the target audience.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-20"),
    cost: 0
  },
  {
    id: 6,
    name: "Monitor System Health",
    description: "Monitor the health of the system and ensure all servers are operating efficiently. Set up automated alerts for any performance issues and respond to them promptly.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-22"),
    cost: 0
  },
  {
    id: 7,
    name: "Test Mobile Responsiveness",
    description: "Test the mobile responsiveness of the landing page to ensure it displays correctly on all devices. Fix any layout issues or bugs that arise during testing.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-25"),
    cost: 0
  },
  {
    id: 8,
    name: "Improve Database Queries",
    description: "Review and optimize database queries to improve response time and reduce load on the server. Ensure the changes are scalable and well-documented.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-04-28"),
    cost: 0
  },
  {
    id: 9,
    name: "Create Press Release",
    description: "Draft and finalize a press release announcing the product launch. Ensure that it communicates the value of the product clearly and is distributed to relevant media outlets.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-01"),
    cost: 0
  },
  {
    id: 10,
    name: "Automate Deployment Pipeline",
    description: "Work with the team to automate the deployment pipeline for faster and more reliable releases. Implement continuous integration/continuous deployment (CI/CD) best practices.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-03"),
    cost: 0
  },
  {
    id: 11,
    name: "Refine UI Elements",
    description: "Lead the team in refining the user interface elements on the landing page. Focus on improving the visual appeal while ensuring ease of navigation for end users.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-06"),
    cost: 0
  },
  {
    id: 12,
    name: "Implement OAuth 2.0 Authentication",
    description: "Implement OAuth 2.0 authentication for the API to ensure secure access for third-party integrations. Test and document the new authentication flow.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-09"),
    cost: 0
  },
  {
    id: 13,
    name: "Analyze Campaign Data",
    description: "Analyze data from the ongoing social media campaign. Prepare a report on the performance and make recommendations for optimization in future campaigns.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-11"),
    cost: 0
  },
  {
    id: 14,
    name: "Update Docker Images",
    description: "Update the Docker images for all services to ensure they are running the latest versions of dependencies. Test to ensure compatibility with existing systems.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-13"),
    cost: 0
  },
  {
    id: 15,
    name: "Conduct User Testing",
    description: "Conduct user testing on the new landing page to gather feedback on usability and design. Analyze the results and implement necessary changes based on user feedback.",
    priority: 1,
    created: new Date(),
    completed: new Date("2025-05-15"),
    cost: 0
  }
];
>>>>>>> e780eed0b08727b46b7b63c2bb71baf351363780
