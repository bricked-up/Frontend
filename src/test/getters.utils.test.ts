/**
 * @fileoverview Jest integration tests for the getter utility functions in getters.utils.ts.
 * @description This file tests the utility functions by making *real* API calls
 * to the backend defined in the environment configuration (API_BASE).
 * Ensure the backend server is running and populated with expected dummy data before running these tests.
 * NOTE: Current tests may fail due to identified backend issues (JSON parsing, SQL errors, missing endpoints).
 */

import {
    getUser,
    getIssue,
    getProjectMembers,
    getProjectIssues,
    getOrgIssues,
} from "../utils/getters.utils"; // Path to the file being tested
// import { API_BASE } from "../config"; // No longer strictly needed here if getters.utils handles it
import { User, Issue, SQLNullTime } from "../utils/types"; // Path to your types file, ensure SQLNullTime is defined if you use it for specific 'completed' assertions

// --- Test Suite ---

/**
 * @description Integration test suite for all getter utility functions.
 */
describe("Getter Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000); // Increase timeout for async tests to 30 seconds

    // --- Tests for getUser ---
    describe("getUser", () => {
        it("should get existing user data successfully (status 200)", async () => {
            const existingUserId = 1; // User ID 1 from populate.sql
            const result = await getUser(existingUserId);

            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            // Assertions based on USER table INSERT for id=1 in populate.sql
            // AND actual backend response structure from backend/users/getUser.go and backend/utils/types.go
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    email: "john.doe@example.com",
                    name: "John Doe", // Backend sends 'name', not 'displayName'
                    avatar: "avatar1.png",
                    verified: true,
                    // Backend also sends:
                    // password: "",
                    // projects: [1, 2],
                    // organizations: [1],
                    // issues: [1]
                    // No 'verifyId' is sent by the /get-user endpoint
                }),
            );
            // More specific checks if needed for arrays, e.g.:
            expect(result.data?.projects).toEqual(expect.arrayContaining([1, 2]));
            expect(result.data?.organizations).toEqual(expect.arrayContaining([1]));
            expect(result.data?.issues).toEqual(expect.arrayContaining([1]));
        });

        /**
         * @description Test case for handling a 'User Not Found'.
         * NOTE: Backend currently sends 200 OK + unparsable body for non-existent user,
         * which our getter catches and returns status 0 + error.
         */
        it("should handle user not found (given backend's current behavior)", async () => {
            const nonExistentUserId = 999999; // Use a user ID known NOT to exist
            const result = await getUser(nonExistentUserId);

            // Assert based on what our frontend getUser utility returns when response.json() fails
            expect(result.status).toBe(0); // Frontend catch block returns 0 on parse error
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            // The error message might vary slightly based on exact failure (empty body vs. non-JSON text)
            // "Network request failed" might also appear if the connection drops before response.json()
            expect(result.error).toMatch(/Unexpected end of JSON input|Network request failed/);
        });
    });

    // --- Tests for getIssue ---
    describe("getIssue", () => {
        it("should get existing issue data successfully (status 200)", async () => {
            const existingIssueId = 1; // Issue ID 1 from populate.sql
            const result = await getIssue(existingIssueId);

            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            // Assertions based on ISSUE table INSERT for id=1 in populate.sql
            // AND actual backend response structure from backend/issues/getIssue.go and backend/utils/types.go
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    title: "Setup Development Environment", // Backend sends 'title'
                    desc: "Install and configure all necessary tools", // Backend sends 'desc'
                    priority: 1, // SQL error "no such column: priority" might be fixed on backend or this field is actually from another table/not directly queried
                    cost: 500,
                    tagid: 1, // Backend sends 'tagid'
                    // created: "2023-01-01T10:00:00Z", // Backend sends specific string. Can use expect.any(String) too.
                    // completed: { Time: "0001-01-01T00:00:00Z", Valid: false }, // Example for null sql.NullTime
                    // dependencies: null, // Or expect.any(Array)
                }),
            );
            // Example of checking the specific 'completed' structure if it's a sql.NullTime
            if (result.data?.completed) {
                 expect(result.data.completed).toHaveProperty('Time');
                 expect(result.data.completed).toHaveProperty('Valid');
            }
        });

        it("should handle issue not found (status 404)", async () => {
            const nonExistentIssueId = 888888; // Use an issue ID known NOT to exist
            const result = await getIssue(nonExistentIssueId);

            // Backend's /get-issue handler correctly returns 404 for "sql.ErrNoRows"
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("Issue not found"); // Match error from backend handler
        });
    });

    // --- Tests for getProjectMembers (Endpoint /proj-members does NOT exist on backend) ---
    describe("getProjectMembers", () => {
        /**
         * @description Test case for fetching members of an existing project.
         * Backend returns 404 because the /proj-members endpoint is not implemented.
         */
        it("should receive 404 for non-existent /proj-members endpoint (even with valid project ID)", async () => {
            const existingProjectIdentifier = "1";
            const result = await getProjectMembers(existingProjectIdentifier);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found"); // Generic message from MainHandler for undefined routes
        });

        it("should handle API error for non-existent /proj-members endpoint (with non-existent project ID)", async () => {
            const nonExistentProjectIdentifier = "non-existent-project";
            const result = await getProjectMembers(nonExistentProjectIdentifier);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });
    });

    // --- Tests for getProjectIssues (Endpoint /get-project-issues does NOT exist on backend) ---
    describe("getProjectIssues", () => {
        /**
         * @description Test case for fetching issues of an existing project.
         * Backend returns 404 because the /get-project-issues endpoint is not implemented.
         */
        it("should receive 404 for non-existent /get-project-issues endpoint (even with valid project ID)", async () => {
            const existingProjectId = 1;
            const result = await getProjectIssues(existingProjectId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });

        it("should handle API error for non-existent /get-project-issues endpoint (with non-existent project ID)", async () => {
            const nonExistentProjectId = 999501;
            const result = await getProjectIssues(nonExistentProjectId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });
    });

    // --- Tests for getOrgIssues (Endpoint /get-org-issues does NOT exist on backend) ---
    describe("getOrgIssues", () => {
        /**
         * @description Test case for fetching issues of an existing organization.
         * Backend returns 404 because the /get-org-issues endpoint is not implemented.
         */
        it("should receive 404 for non-existent /get-org-issues endpoint (even with valid org ID)", async () => {
            const existingOrgId = 1;
            const result = await getOrgIssues(existingOrgId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });

        it("should handle API error for non-existent /get-org-issues endpoint (with non-existent org ID)", async () => {
            const nonExistentOrgId = 99921;
            const result = await getOrgIssues(nonExistentOrgId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });
    });
});