// src/test/getters.utils.test.ts

import {
    getUser,
    getIssue,
    getAllUsers,
    getOrg,
    getOrgMember,
    getProject,
    getProjectMember,
    getOrgRole,      // <-- Import new getter
    getProjectRole   // <-- Import new getter
} from "../utils/getters.utils";
import {
    User,
    Issue,
    OrgMember,
    ProjectMember,
    Organization,
    Project,
    OrgRole,         // <-- Import new type
    ProjectRole      // <-- Import new type
} from "../utils/types";

describe("Getter Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000);

    describe("getUser", () => {
        const existingUserId = 1;
        const nonExistentUserId = 999999;

        it("should get existing user data successfully (status 200)", async () => {
            const result = await getUser(existingUserId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: existingUserId,
                    email: "john.doe@example.com", // Adjust to your test data
                    name: "John Doe",             // Adjust to your test data
                    avatar: "avatar1.png",        // Adjust to your test data
                    verified: true,
                    organizations: expect.arrayContaining([expect.any(Number)]),
                    projects: expect.arrayContaining([expect.any(Number)]),
                    issues: expect.arrayContaining([expect.any(Number)]),
                }),
            );
        });

        it("should handle user not found (status 404, data: {})", async () => {
            const result = await getUser(nonExistentUserId);
            expect(result.status).toBe(404);
            expect(result.data).toEqual(null);
            expect(result.error?.trim()).toBe("UserId not found");
        });
    });

    describe("getIssue", () => {
        const existingIssueId = 1;
        const nonExistentIssueId = 888888;

        it("should get existing issue data successfully (status 200)", async () => {
            const result = await getIssue(existingIssueId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: existingIssueId,
                    title: "Setup Development Environment", // Adjust to your test data
                    tagId: 1,
                }),
            );
            if (result.data?.created) {
                expect(result.data.created).toBeInstanceOf(Date);
            }
        });

        it("should handle issue not found (status 404)", async () => {
            const result = await getIssue(nonExistentIssueId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });

    describe("getAllUsers", () => {
        it("should get all user IDs successfully (status 200)", async () => {
            const result = await getAllUsers();
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).toBeInstanceOf(Array);
            if (result.data && result.data.length > 0) {
                expect(typeof result.data[0]).toBe('number');
                result.data.forEach(item => expect(typeof item).toBe('number'));
            } else {
                console.warn("getAllUsers returned empty or null data. This may be valid.");
            }
        });
    });

    describe("getOrg", () => {
        const existingOrgId = 1;
        const nonExistentOrgId = 90909;

        it("should get existing organization data (status 200)", async () => {
            const result = await getOrg(existingOrgId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect((result.data as Organization).id).toBe(existingOrgId);
            // expect((result.data as Organization).name).toBe("Bricked Up Solutions"); // Adjust
        });

        it("should handle organization not found (status 404)", async () => {
            const result = await getOrg(nonExistentOrgId);
            expect(result.status).toBe(500);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });

    describe("getProject", () => {
        const existingProjectId = 1;
        const nonExistentProjectId = 80808;

        it("should get existing project data successfully (status 200)", async () => {
            const result = await getProject(existingProjectId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect((result.data as Project).id).toBe(existingProjectId);
            // expect((result.data as Project).name).toBe("Project Alpha"); // Adjust
            if ((result.data as Project).issues && (result.data as Project).issues!.length > 0) {
                const firstIssue = (result.data as Project).issues![0];
                if (firstIssue.created) expect(firstIssue.created).toBeInstanceOf(Date);
                expect(firstIssue).toHaveProperty('tagId');
                expect(firstIssue).not.toHaveProperty('tagid');
            }
        });

        it("should handle project not found (status 404, data: {})", async () => {
            const result = await getProject(nonExistentProjectId);
            expect(result.status).toBe(404);
            expect(result.data).toEqual(null);
            expect(result.error?.trim()).toBe("sql: no rows in result set");
        });
    });

    describe("getOrgMember", () => {
        const existingOrgMemberId = 1; // Ensure this ID exists in your test DB
        const nonExistentOrgMemberId = 70707;

        it("should get existing org member data and map fields (status 200)", async () => {
            const result = await getOrgMember(existingOrgMemberId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            const memberData = result.data as OrgMember;
            expect(memberData.id).toBe(existingOrgMemberId);
            expect(memberData).toHaveProperty("userId");
            expect(memberData).toHaveProperty("orgId");
            // Check for aggregated permissions (adjust expected boolean values based on your test data for orgMemberId 1)
            expect(memberData).toHaveProperty("canExec"); // e.g., expect(memberData.canExec).toBe(true);
            expect(memberData).toHaveProperty("canRead"); // e.g., expect(memberData.canRead).toBe(true);
            expect(memberData).toHaveProperty("canWrite"); // e.g., expect(memberData.canWrite).toBe(false);

            expect(memberData).not.toHaveProperty("userid");
            expect(memberData).not.toHaveProperty("orgid");
            // Check that snake_case permissions are not present if mapped and deleted
            expect(memberData).not.toHaveProperty("can_exec");
            expect(memberData).not.toHaveProperty("can_read");
            expect(memberData).not.toHaveProperty("can_write");
        });

        it("should handle org member not found (status 404)", async () => {
            const result = await getOrgMember(nonExistentOrgMemberId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });

    describe("getProjectMember", () => {
        const existingProjectMemberId = 1; // Ensure this ID exists in your test DB
        const nonExistentProjectMemberId = 60606;

        it("should get existing project member data and map fields (status 200)", async () => {
            const result = await getProjectMember(existingProjectMemberId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            const memberData = result.data as ProjectMember;
            expect(memberData.id).toBe(existingProjectMemberId);
            expect(memberData).toHaveProperty("userId");
            expect(memberData).toHaveProperty("projectId");
            // Check for aggregated permissions (adjust expected boolean values based on your test data for projectMemberId 1)
            expect(memberData).toHaveProperty("canExec"); // e.g., expect(memberData.canExec).toBe(true);
            expect(memberData).toHaveProperty("canRead"); // e.g., expect(memberData.canRead).toBe(true);
            expect(memberData).toHaveProperty("canWrite"); // e.g., expect(memberData.canWrite).toBe(false);
            // Check for roles and issues if they are expected for this member
            if (memberData.roles) { // roles on ProjectMember is number[]
                expect(Array.isArray(memberData.roles)).toBe(true);
                if (memberData.roles.length > 0) {
                    expect(typeof memberData.roles[0]).toBe('number');
                }
            }
            if (memberData.issues) { // issues on ProjectMember is number[]
                expect(Array.isArray(memberData.issues)).toBe(true);
                 if (memberData.issues.length > 0) {
                    expect(typeof memberData.issues[0]).toBe('number');
                }
            }

            expect(memberData).not.toHaveProperty("userid");
            expect(memberData).not.toHaveProperty("projectid");
            expect(memberData).not.toHaveProperty("can_exec");
            expect(memberData).not.toHaveProperty("can_read");
            expect(memberData).not.toHaveProperty("can_write");
        });

        it("should handle project member not found (status 404)", async () => {
            const result = await getProjectMember(nonExistentProjectMemberId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });

    // --- START: New Tests for getOrgRole and getProjectRole ---
    describe("getOrgRole", () => {
        const existingOrgRoleId = 1; // Replace with an actual existing OrgRole ID from your test DB
        const nonExistentOrgRoleId = 55555;

        it("should get existing organization role data and map fields (status 200)", async () => {
            const result = await getOrgRole(existingOrgRoleId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            const roleData = result.data as OrgRole;
            expect(roleData.id).toBe(existingOrgRoleId);
            expect(roleData).toHaveProperty("name");    // e.g., expect(roleData.name).toBe("Admin");
            expect(roleData).toHaveProperty("orgId");   // e.g., expect(roleData.orgId).toBe(1);
            expect(roleData).toHaveProperty("canExec"); // e.g., expect(roleData.canExec).toBe(true);
            expect(roleData).toHaveProperty("canRead"); // e.g., expect(roleData.canRead).toBe(true);
            expect(roleData).toHaveProperty("canWrite");// e.g., expect(roleData.canWrite).toBe(true);

            // Ensure original snake_case fields are not present after mapping
            expect(roleData).not.toHaveProperty("orgid");
            expect(roleData).not.toHaveProperty("can_exec");
            expect(roleData).not.toHaveProperty("can_read");
            expect(roleData).not.toHaveProperty("can_write");
        });

        it("should handle organization role not found (status 404)", async () => {
            const result = await getOrgRole(nonExistentOrgRoleId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });

    describe("getProjectRole", () => {
        const existingProjectRoleId = 1; // Replace with an actual existing ProjectRole ID from your test DB
        const nonExistentProjectRoleId = 66666;

        it("should get existing project role data and map fields (status 200)", async () => {
            const result = await getProjectRole(existingProjectRoleId);
            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            const roleData = result.data as ProjectRole;
            expect(roleData.id).toBe(existingProjectRoleId);
            expect(roleData).toHaveProperty("name");      // e.g., expect(roleData.name).toBe("Project Lead");
            expect(roleData).toHaveProperty("projectId"); // e.g., expect(roleData.projectId).toBe(1);
            expect(roleData).toHaveProperty("canExec");   // e.g., expect(roleData.canExec).toBe(true);
            expect(roleData).toHaveProperty("canRead");   // e.g., expect(roleData.canRead).toBe(true);
            expect(roleData).toHaveProperty("canWrite");  // e.g., expect(roleData.canWrite).toBe(true);

            // Ensure original snake_case fields are not present after mapping
            expect(roleData).not.toHaveProperty("projectid");
            expect(roleData).not.toHaveProperty("can_exec");
            expect(roleData).not.toHaveProperty("can_read");
            expect(roleData).not.toHaveProperty("can_write");
        });

        it("should handle project role not found (status 404)", async () => {
            const result = await getProjectRole(nonExistentProjectRoleId);
            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });
    // --- END: New Tests ---
});