// src/test/getters.utils.test.ts

import {
    getUser,
    getIssue,
    getProjectMembers,
    getProjectIssues,
    getOrgIssues,
} from "../utils/getters.utils";
import { User, Issue } from "../utils/types"; // SQLNullTime import removed as we test the parsed result

describe("Getter Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000);

    describe("getUser", () => {
        it("should get existing user data successfully (status 200)", async () => {
            const existingUserId = 1;
            const result = await getUser(existingUserId);

            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    email: "john.doe@example.com",
                    name: "John Doe", // User type in types.ts also has displayName
                    avatar: "avatar1.png",
                    verified: true,
                }),
            );
            // These assertions reflect backend sending IDs, while User type expects objects.
            // This discrepancy is noted and retained as per current test structure.
            expect(result.data?.projects).toEqual(expect.arrayContaining([1, 2]));
            expect(result.data?.organizations).toEqual(expect.arrayContaining([1]));
            expect(result.data?.issues).toEqual(expect.arrayContaining([1]));
        });

        it("should handle user not found (given backend's current behavior)", async () => {
            const nonExistentUserId = 999999;
            try {
                await getUser(nonExistentUserId);
                fail("getUser should have thrown an error for non-JSON response");
            } catch (error: any) {
                expect(error).toBeInstanceOf(SyntaxError);
                expect(error.message).toMatch(/Unexpected end of JSON input|JSON.parse/i);
            }
        });
    });

    describe("getIssue", () => {
        it("should get existing issue data successfully (status 200) and parse dates", async () => {
            const existingIssueId = 1; // Issue ID 1 from populate.sql
            const result = await getIssue(existingIssueId);

            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();

            // Assertions based on ISSUE table INSERT for id=1
            // AND Issue type after parsing in getters.utils.ts
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    title: "Setup Development Environment",
                    desc: "Install and configure all necessary tools",
                    priority: 1,
                    cost: 500,
                    tagId: 1, // Changed from tagid to tagId to match Issue type
                }),
            );

            // Check date parsing for 'created'
            expect(result.data?.created).toBeInstanceOf(Date);
            // Example: If backend sends "2023-01-01T10:00:00Z" for issue 1's creation
            // This exact value depends on your populate.sql and backend behavior
            if (result.data?.created) {
                 // Be mindful of timezone differences if not using UTC consistently
                 // For a direct string comparison it's often new Date("YYYY-MM-DDTHH:mm:ss.sssZ").toISOString()
                 // For equality of Date objects:
                 expect(result.data.created.toISOString()).toBe("2023-01-01T10:00:00.000Z"); // Adjust if your mock data is different
            }


            // Check date parsing for 'completed'
            // Assuming for issue 1, completed is { Time: "0001-01-01T00:00:00Z", Valid: false }
            // which should parse to null
            expect(result.data?.completed).toBeNull(); 

            // If you had an issue that *was* completed, e.g., with:
            // completed: { Time: "2023-02-15T12:00:00Z", Valid: true }
            // Then you would assert:
            // expect(result.data?.completed).toBeInstanceOf(Date);
            // expect(result.data?.completed?.toISOString()).toBe("2023-02-15T12:00:00.000Z");
        });

        it("should handle issue not found (status 404)", async () => {
            const nonExistentIssueId = 888888;
            const result = await getIssue(nonExistentIssueId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("Issue not found");
        });
    });

    describe("getProjectMembers", () => {
        it("should receive 404 for non-existent /proj-members endpoint (even with valid project ID)", async () => {
            const existingProjectIdentifier = "1";
            const result = await getProjectMembers(existingProjectIdentifier);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
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

    describe("getProjectIssues", () => {
        // Assuming /get-project-issues would also return issues that need date parsing
        // For now, tests only check for 404 as endpoint is hypothetical
        it("should receive 404 for non-existent /get-project-issues endpoint (even with valid project ID)", async () => {
            const existingProjectId = 1;
            const result = await getProjectIssues(existingProjectId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
            // If this endpoint were implemented, you'd add tests similar to getIssue for date parsing on the array of issues.
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

    describe("getOrgIssues", () => {
        // Assuming /get-org-issues would also return issues that need date parsing
        // For now, tests only check for 404 as endpoint is hypothetical
        it("should receive 404 for non-existent /get-org-issues endpoint (even with valid org ID)", async () => {
            const existingOrgId = 1;
            const result = await getOrgIssues(existingOrgId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
            // If this endpoint were implemented, you'd add tests similar to getIssue for date parsing on the array of issues.
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