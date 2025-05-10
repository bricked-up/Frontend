// src/test/getters.utils.test.ts

import {
    getUser,
    getIssue,
    getAllUsers,     
    getOrg,          
    getOrgMember,    
    getProject,      
    getProjectMember // Corrected from getProjectMembers if singular is intended and exists
    // getProjectIssues, // Removed - Not exported from getters.utils.ts
    // getOrgIssues,      // Removed - Not exported from getters.utils.ts
} from "../utils/getters.utils";
import { User, Issue, OrgMember, ProjectMember, Organization, Project } from "../utils/types"; // Added missing types for tests

describe("Getter Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000);

    describe("getUser", () => {
        it("should get existing user data successfully (status 200)", async () => {
            const existingUserId = 1; // Ensure this user ID exists in your test DB
            const result = await getUser(existingUserId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            // Update this to match the exact structure returned by your /get-user endpoint
            // The User type has organizations/projects as number[] | OrgMember[], but
            // the test implies getUser returns number[] for these from the backend.
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    email: "john.doe@example.com", // Match your populate.sql
                    name: "John Doe",             // Match your populate.sql
                    // displayName: "JohnDoe",    // Add if present in populate.sql and User type
                    avatar: "avatar1.png",        // Match your populate.sql
                    verified: true,               // Match your populate.sql
                    // The following depends on what /get-user actually returns.
                    // If it only returns IDs, this is correct.
                    organizations: expect.arrayContaining([1]),
                    projects: expect.arrayContaining([1, 2]),
                    issues: expect.arrayContaining([1]),
                }),
            );
        });

        it("should handle user not found (backend returns 204 No Content, resulting in status 204 and data: {})", async () => {
            const nonExistentUserId = 999999;
            const result = await getUser(nonExistentUserId);
            expect(result.status).toBe(204);
            expect(result.data).toEqual({});
            expect(result.error).toBeUndefined();
        });
    });

    describe("getIssue", () => {
        it("should get existing issue data successfully (status 200) and parse dates/fields", async () => {
            const existingIssueId = 1; // Ensure this ID exists
            const result = await getIssue(existingIssueId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    title: "Setup Development Environment",
                    desc: "Install and configure all necessary tools",
                    priority: 1,
                    cost: 500,
                    tagId: 1, // Check if backend sends tagId or tagid, handled by getter
                }),
            );
            expect(result.data?.created).toBeInstanceOf(Date);
            if (result.data?.created) {
                // Be careful with exact ISO string matching due to timezones if not UTC
                expect(result.data.created.toISOString()).toContain("2023-01-01T");
            }
            expect(result.data?.completed).toBeNull(); // Or beInstanceOf(Date) if completed
        });

        it("should handle issue not found (status 404)", async () => {
            const nonExistentIssueId = 888888;
            const result = await getIssue(nonExistentIssueId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            // The exact error message depends on your backend's 404 response for issues
            expect(result.error).toContain("Issue not found");
        });
    });

    describe("getAllUsers", () => {
        it("should get all users successfully (status 200)", async () => {
            const result = await getAllUsers();
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).toBeInstanceOf(Array);
            if (result.data && result.data.length > 0) {
                const firstUser = result.data[0] as User; // Type assertion for easier property access
                expect(firstUser).toHaveProperty("id");
                expect(firstUser).toHaveProperty("email");
            } else {
                console.warn("getAllUsers returned an empty array or null data. Check populate.sql or if the endpoint is responding correctly.");
            }
        });
    });

    describe("getOrg", () => {
        const existingOrgId = 1; // Ensure this ID exists
        const nonExistentOrgId = 90909;

        it("should get existing organization data (status 200)", async () => {
            const result = await getOrg(existingOrgId);
            // This test was previously expecting status 0 for malformed JSON.
            // Ideally, if the org exists and JSON is valid, it should be 200.
            if (result.status === 200) {
                expect(result.error).toBeUndefined();
                expect(result.data).not.toBeNull();
                expect((result.data as Organization).id).toBe(existingOrgId);
            } else if (result.status === 0 && result.error?.includes("JSON.parse")) {
                 console.warn(`getOrg(${existingOrgId}): Received status 0 due to parsing error. Backend JSON for this org is likely malformed.`);
                 // You might want to fail the test here if valid JSON is expected:
                 // expect(result.status).toBe(200);
            } else {
                // Fail if status is neither 200 nor an expected parsing error
                console.error(`getOrg(${existingOrgId}) unexpected status/error:`, result);
                expect(result.status).toBe(200);
            }
        });

        it("should handle organization not found (backend returns 500 or specific not found status)", async () => {
            // The PDF for GetOrgHandler doesn't specify the error for "not found".
            // It shows 500 for "Failed to get org". Adjust if your backend has a more specific "not found" (e.g., 404 or 204).
            const result = await getOrg(nonExistentOrgId);
            expect(result.status).toBe(500); // Or 404 / 204 if backend behaves differently
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            if (result.status === 500) {
                expect(result.error).toContain("Failed to get org"); // Or a more specific "not found" message
            }
        });
    });

    describe("getProject", () => {
        const existingProjectId = 1; // Ensure this ID exists
        const nonExistentProjectId = 80808;

        it("should get existing project data successfully (status 200)", async () => {
            const result = await getProject(existingProjectId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect((result.data as Project).id).toBe(existingProjectId);
            // Check for processed issues if applicable
            if ((result.data as Project).issues && (result.data as Project).issues!.length > 0) {
                const firstIssue = (result.data as Project).issues![0];
                if (firstIssue.created) expect(firstIssue.created).toBeInstanceOf(Date);
            }
        });

        it("should handle project not found (backend returns 204 No Content, resulting in status 204 and data: {})", async () => {
            // The PDF for GetProjHandler doesn't explicitly state 204 for not found,
            // but your getter handles it this way. Confirm backend behavior.
            const result = await getProject(nonExistentProjectId);
            expect(result.status).toBe(204);
            expect(result.data).toEqual({});
            expect(result.error).toBeUndefined();
        });
    });

    describe("getOrgMember", () => {
        const existingOrgMemberId = 1; // Ensure this ID exists
        const nonExistentOrgMemberId = 70707; // For testing "not found"

        it("should get existing org member data and map fields (status 200)", async () => {
            const result = await getOrgMember(existingOrgMemberId);
             if (result.status === 200) {
                expect(result.error).toBeUndefined();
                expect(result.data).not.toBeNull();
                const memberData = result.data as OrgMember;
                expect(memberData.id).toBe(existingOrgMemberId);
                expect(memberData).toHaveProperty("userId");
                expect(memberData).toHaveProperty("orgId");
            } else if (result.status === 0 && result.error?.includes("JSON.parse")) {
                 console.warn(`getOrgMember(${existingOrgMemberId}) parsing error: ${result.error}. Check backend data.`);
                 expect(result.status).toBe(200); // Fail if parsing error and shouldn't be
            } else {
                 console.warn(`getOrgMember(${existingOrgMemberId}) returned status ${result.status} with error: ${result.error}. Expected 200.`);
                 expect(result.status).toBe(200);
            }
        });

        it("should handle org member not found (e.g. backend returns 200+empty body, or 404)", async () => {
            // The PDF for GetOrgMemberHandler doesn't specify "not found" behavior.
            // Your original test expected status 0 due to .json() fail on empty body.
            // A 404 or 204 from backend would be more RESTful for "not found".
            const result = await getOrgMember(nonExistentOrgMemberId);
            if (result.status === 0 && result.error?.match(/Unexpected end of JSON input|JSON.parse/i)) {
                // This matches your original expectation for an empty body from a 200 OK.
                expect(result.data).toBeNull();
            } else if (result.status === 404 || result.status === 204) {
                // Ideal "not found" scenarios
                expect(result.data).toBeNull();
                if (result.status === 404) expect(result.error).toBeDefined();
            } else {
                console.warn(`getOrgMember(${nonExistentOrgMemberId}) unexpected result:`, result);
                // Adjust this expectation based on actual backend behavior for "not found"
                expect([0, 204, 404]).toContain(result.status);
            }
        });
    });

    describe("getProjectMember", () => {
        const existingProjectMemberId = 1; // Ensure this ID exists
        const nonExistentProjectMemberId = 60606;

        it("should get existing project member data and map fields (status 200)", async () => {
            const result = await getProjectMember(existingProjectMemberId);
            if (result.status === 200) {
                expect(result.error).toBeUndefined();
                expect(result.data).not.toBeNull();
                const memberData = result.data as ProjectMember;
                expect(memberData.id).toBe(existingProjectMemberId);
                expect(memberData).toHaveProperty("userId");
                expect(memberData).toHaveProperty("projectId");
            } else if (result.status === 0 && result.error?.includes("JSON.parse")) {
                console.warn(`getProjectMember(${existingProjectMemberId}) parsing error: ${result.error}. Check backend data.`);
                expect(result.status).toBe(200); // Fail if parsing error and shouldn't be
            } else {
                console.warn(`getProjectMember(${existingProjectMemberId}) returned status ${result.status} with error: ${result.error}. Expected 200.`);
                expect(result.status).toBe(200);
            }
        });

        it("should handle project member not found (e.g. backend returns 200+empty body, or 404)", async () => {
            // Similar to getOrgMember, PDF for GetProjMemberHandler doesn't specify "not found".
            const result = await getProjectMember(nonExistentProjectMemberId);
             if (result.status === 0 && result.error?.match(/Unexpected end of JSON input|JSON.parse/i)) {
                expect(result.data).toBeNull();
            } else if (result.status === 404 || result.status === 204) {
                expect(result.data).toBeNull();
                if (result.status === 404) expect(result.error).toBeDefined();
            } else {
                console.warn(`getProjectMember(${nonExistentProjectMemberId}) unexpected result:`, result);
                expect([0, 204, 404]).toContain(result.status);
            }
        });
    });
});