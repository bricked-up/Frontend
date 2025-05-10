// src/test/getters.utils.test.ts

import {
    getUser,
    getIssue,
    getAllUsers,
    getOrg,
    getOrgMember,
    getProject,
    getProjectMember
} from "../utils/getters.utils";
import { User, Issue, OrgMember, ProjectMember, Organization, Project } from "../utils/types";

describe("Getter Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000); // Increased timeout for network requests

    describe("getUser", () => {
        const existingUserId = 1; // Ensure this user ID exists in your test DB
        const nonExistentUserId = 999999;

        it("should get existing user data successfully (status 200)", async () => {
            const result = await getUser(existingUserId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            // This assertion depends heavily on what /get-user actually returns
            // and what is populated in your test database for user 1.
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: existingUserId,
                    email: "john.doe@example.com", // From your populate.sql or test DB
                    name: "John Doe",             // From your populate.sql or test DB
                    avatar: "avatar1.png",        // From your populate.sql or test DB
                    verified: true,               // From your populate.sql or test DB
                    // Assuming /get-user returns arrays of IDs for these fields:
                    organizations: expect.arrayContaining([expect.any(Number)]), // or specific IDs if known
                    projects: expect.arrayContaining([expect.any(Number)]),      // or specific IDs if known
                    issues: expect.arrayContaining([expect.any(Number)]),        // or specific IDs if known
                }),
            );
        });

        it("should handle user not found (backend returns 204 No Content, resulting in status 204 and data: {})", async () => {
            const result = await getUser(nonExistentUserId);
            expect(result.status).toBe(204); // Assuming backend sends 204 for not found user
            expect(result.data).toEqual({}); // As per getter logic for empty text from 204
            expect(result.error).toBeUndefined();
        });
    });

    describe("getIssue", () => {
        const existingIssueId = 1; // Ensure this ID exists
        const nonExistentIssueId = 888888;

        it("should get existing issue data successfully (status 200) and parse dates/fields", async () => {
            const result = await getIssue(existingIssueId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: existingIssueId,
                    title: "Setup Development Environment", // From your populate.sql or test DB
                    desc: "Install and configure all necessary tools", // From your populate.sql or test DB
                    priority: 1, // From your populate.sql or test DB
                    cost: 500,   // From your populate.sql or test DB
                    tagId: 1,    // From your populate.sql or test DB (getter handles tagid/tagId)
                }),
            );
            if (result.data?.created) { // Ensure created is not null before checking
                expect(result.data.created).toBeInstanceOf(Date);
                 // Example: expect(result.data.created.toISOString()).toContain("2023-01-01"); // Adjust date
            }
            // Check 'completed' based on your test data for issue 1
            // expect(result.data?.completed).toBeNull(); or expect(result.data?.completed).toBeInstanceOf(Date);
        });

        it("should handle issue not found (status 404)", async () => {
            const result = await getIssue(nonExistentIssueId);
            expect(result.status).toBe(404); // Backend now sends 404 for not found
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            // You might want to check for a specific error message if the backend sends one
            // expect(result.error).toContain("Issue not found");
        });
    });

    describe("getAllUsers", () => {
        it("should get all user IDs successfully (status 200)", async () => {
            const result = await getAllUsers();
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).toBeInstanceOf(Array);
            if (result.data && result.data.length > 0) {
                // Backend confirmed to return an array of user IDs
                expect(typeof result.data[0]).toBe('number');
                // Optionally, check if all elements are numbers
                result.data.forEach(item => expect(typeof item).toBe('number'));
            } else {
                // This is okay if the database can be empty, or warn if users are expected
                console.warn("getAllUsers returned an empty array or null data. This might be valid if no users exist.");
            }
        });
    });

    describe("getOrg", () => {
        const existingOrgId = 1; // Ensure this ID exists
        const nonExistentOrgId = 90909;

        it("should get existing organization data (status 200)", async () => {
            const result = await getOrg(existingOrgId);
            // Backend fixed malformed JSON for orgId=1
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect((result.data as Organization).id).toBe(existingOrgId);
            // Add more specific assertions for organization properties if needed
            // expect((result.data as Organization).name).toBe("Expected Org Name");
        });

        it("should handle organization not found (status 404)", async () => {
            // Backend now sends 404 for not found organizations
            const result = await getOrg(nonExistentOrgId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            // Optionally check for a specific error message
            // expect(result.error).toContain("Organization not found");
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
            if ((result.data as Project).issues && (result.data as Project).issues!.length > 0) {
                const firstIssue = (result.data as Project).issues![0];
                if (firstIssue.created) expect(firstIssue.created).toBeInstanceOf(Date);
                // Ensure tagId is present and tagid is not, if mapping occurred
                expect(firstIssue).toHaveProperty('tagId');
                expect(firstIssue).not.toHaveProperty('tagid');
            }
        });

        it("should handle project not found (backend returns 204 No Content, resulting in status 204 and data: {})", async () => {
            // Assuming /get-proj still uses 204 for not found as per original test logic
            const result = await getProject(nonExistentProjectId);
            expect(result.status).toBe(204);
            expect(result.data).toEqual({}); // Getter handles empty text from 204
            expect(result.error).toBeUndefined();
        });
    });

    describe("getOrgMember", () => {
        const existingOrgMemberId = 1; // Ensure this ID exists
        const nonExistentOrgMemberId = 70707;

        it("should get existing org member data and map fields (status 200)", async () => {
            const result = await getOrgMember(existingOrgMemberId);
            expect(result.status).toBe(200); // Assuming successful fetch
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            const memberData = result.data as OrgMember;
            expect(memberData.id).toBe(existingOrgMemberId);
            // Getter now maps userid and orgid (from backend) to userId and orgId
            expect(memberData).toHaveProperty("userId");
            expect(memberData).toHaveProperty("orgId");
            expect(memberData).not.toHaveProperty("userid"); // Check that original lowercase field is removed
            expect(memberData).not.toHaveProperty("orgid");  // Check that original lowercase field is removed
        });

        it("should handle org member not found (status 404)", async () => {
            // Backend now sends 404 for not found org members
            const result = await getOrgMember(nonExistentOrgMemberId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull(); // Getter's robust parsing should yield null data for 404
            expect(result.error).toBeDefined();
        });
    });

    describe("getProjectMember", () => {
        const existingProjectMemberId = 1; // Ensure this ID exists
        const nonExistentProjectMemberId = 60606;

        it("should get existing project member data and map fields (status 200)", async () => {
            const result = await getProjectMember(existingProjectMemberId);
            expect(result.status).toBe(200); // Assuming successful fetch
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            const memberData = result.data as ProjectMember;
            expect(memberData.id).toBe(existingProjectMemberId);
            // Getter maps userid and projectid
            expect(memberData).toHaveProperty("userId");
            expect(memberData).toHaveProperty("projectId");
            expect(memberData).not.toHaveProperty("userid");    // Check that original lowercase field is removed
            expect(memberData).not.toHaveProperty("projectid"); // Check that original lowercase field is removed
        });

        it("should handle project member not found (status 404)", async () => {
            // Backend now sends 404 for not found project members
            const result = await getProjectMember(nonExistentProjectMemberId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull(); // Getter's robust parsing should yield null data for 404
            expect(result.error).toBeDefined();
        });
    });
});