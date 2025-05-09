// src/test/getters.utils.test.ts

import {
    getUser,
    getIssue,
    getProjectMembers,
    getProjectIssues,
    getOrgIssues,
} from "../utils/getters.utils";
import { User, Issue } from "../utils/types";

/**
 * @fileoverview Jest integration tests for the getter utility functions in getters.utils.ts.
 * @description This file contains integration tests that verify the functionality of getter utility
 * functions by making *real* API calls to the backend. The backend is defined by the
 * API_BASE environment configuration.
 *
 * It is crucial that the backend server is running and populated with the expected dummy
 * data (as defined in `populate.sql` or similar setup scripts) before these tests are executed.
 *
 * Note: Some tests might anticipate failures or specific error responses due to known
 * backend issues such as JSON parsing errors for certain non-existent resource scenarios,
 * SQL errors, or missing endpoints for hypothetical functions.
 */

/**
 * @description Defines the test suite for all getter utility functions.
 * This suite groups integration tests for `getUser`, `getIssue`, `getProjectMembers`,
 * `getProjectIssues`, and `getOrgIssues`.
 */
describe("Getter Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000); // Increased timeout for asynchronous API calls

    /**
     * @description Test suite for the `getUser` function.
     * It covers scenarios like successfully fetching an existing user and handling cases
     * where a user is not found.
     */
    describe("getUser", () => {
        /**
         * @description Tests if `getUser` successfully retrieves data for an existing user (ID 1).
         * It expects a 200 status, no error, and the user data to match the
         * structure and values from the `populate.sql` script, including nested arrays of IDs
         * for projects, organizations, and issues.
         */
        it("should get existing user data successfully (status 200)", async () => {
            const existingUserId = 1; // User ID 1 from populate.sql
            const result = await getUser(existingUserId);

            expect(result.status).toBe(200);
            expect(result.error).toBeUndefined();
            expect(result.data).not.toBeNull();
            expect(result.data).toEqual(
                expect.objectContaining({
                    id: 1,
                    email: "john.doe@example.com",
                    name: "John Doe",
                    avatar: "avatar1.png",
                    verified: true,
                }),
            );
            expect(result.data?.projects).toEqual(expect.arrayContaining([1, 2]));
            expect(result.data?.organizations).toEqual(expect.arrayContaining([1]));
            expect(result.data?.issues).toEqual(expect.arrayContaining([1]));
        });

        /**
         * @description Tests how `getUser` handles a request for a non-existent user ID.
         * Based on current backend behavior, this might involve the backend sending an
         * unparsable response (e.g., non-JSON) even with a 200 OK status, which
         * `response.json()` would fail to parse. With the try-catch block in `getUser`
         * commented out, this test expects the `getUser` promise to reject with a SyntaxError.
         */
        it("should handle user not found (given backend's current behavior)", async () => {
            const nonExistentUserId = 999999; // A user ID known not to exist
            try {
                await getUser(nonExistentUserId);
                fail("getUser should have thrown an error for non-JSON response");
            } catch (error: any) {
                expect(error).toBeInstanceOf(SyntaxError);
                expect(error.message).toMatch(/Unexpected end of JSON input|JSON.parse/i);
            }
        });
    });

    /**
     * @description Test suite for the `getIssue` function.
     * It includes tests for fetching an existing issue successfully (including date parsing)
     * and handling cases where an issue is not found (404 error).
     */
    describe("getIssue", () => {
        /**
         * @description Tests if `getIssue` successfully retrieves and parses data for an existing issue (ID 1).
         * It expects a 200 status, no error, and correctly parsed issue data,
         * including `created` as a Date object and `completed` as null (based on mock data).
         * It also verifies that `tagId` is correctly identified.
         */
        it("should get existing issue data successfully (status 200) and parse dates", async () => {
            const existingIssueId = 1; // Issue ID 1 from populate.sql
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
                    tagId: 1,
                }),
            );

            expect(result.data?.created).toBeInstanceOf(Date);
            if (result.data?.created) {
                 expect(result.data.created.toISOString()).toBe("2023-01-01T10:00:00.000Z"); // Adjust if mock data differs
            }

            expect(result.data?.completed).toBeNull(); // Assuming mock data for issue 1 has Valid: false for completed
        });

        /**
         * @description Tests how `getIssue` handles a request for a non-existent issue ID.
         * It expects the backend to return a 404 status and an error message
         * indicating that the issue was not found.
         */
        it("should handle issue not found (status 404)", async () => {
            const nonExistentIssueId = 888888; // An issue ID known not to exist
            const result = await getIssue(nonExistentIssueId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("Issue not found");
        });
    });

    /**
     * @description Test suite for the `getProjectMembers` function.
     * Since the `/proj-members` endpoint is noted as non-existent or hypothetical,
     * these tests primarily verify that the function correctly handles the expected
     * 404 error from the backend.
     */
    describe("getProjectMembers", () => {
        /**
         * @description Tests that `getProjectMembers` receives a 404 error when called,
         * even with a potentially valid project identifier, due to the non-existent
         * `/proj-members` endpoint.
         */
        it("should receive 404 for non-existent /proj-members endpoint (even with valid project ID)", async () => {
            const existingProjectIdentifier = "1"; // Example project identifier
            const result = await getProjectMembers(existingProjectIdentifier);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });

        /**
         * @description Tests that `getProjectMembers` handles API errors (specifically a 404)
         * correctly when a non-existent project identifier is used with the
         * non-existent `/proj-members` endpoint.
         */
        it("should handle API error for non-existent /proj-members endpoint (with non-existent project ID)", async () => {
            const nonExistentProjectIdentifier = "non-existent-project";
            const result = await getProjectMembers(nonExistentProjectIdentifier);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });
    });

    /**
     * @description Test suite for the `getProjectIssues` function.
     * As the `/get-project-issues` endpoint is hypothetical and assumed not to exist,
     * these tests focus on the function's behavior when encountering a 404 error.
     */
    describe("getProjectIssues", () => {
        /**
         * @description Tests that `getProjectIssues` correctly receives a 404 error
         * for the non-existent `/get-project-issues` endpoint, even if a valid project ID
         * is provided.
         */
        it("should receive 404 for non-existent /get-project-issues endpoint (even with valid project ID)", async () => {
            const existingProjectId = 1; // Example project ID
            const result = await getProjectIssues(existingProjectId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });

        /**
         * @description Verifies that `getProjectIssues` handles the 404 API error
         * when a non-existent project ID is used with the non-existent
         * `/get-project-issues` endpoint.
         */
        it("should handle API error for non-existent /get-project-issues endpoint (with non-existent project ID)", async () => {
            const nonExistentProjectId = 999501; // A project ID known not to exist
            const result = await getProjectIssues(nonExistentProjectId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });
    });

    /**
     * @description Test suite for the `getOrgIssues` function.
     * Similar to other hypothetical endpoints, these tests ensure that the function
     * handles the 404 error returned for the non-existent `/get-org-issues` endpoint.
     */
    describe("getOrgIssues", () => {
        /**
         * @description Checks that `getOrgIssues` receives a 404 error when attempting
         * to fetch issues for an organization, given the `/get-org-issues` endpoint
         * is not implemented. This applies even for valid organization IDs.
         */
        it("should receive 404 for non-existent /get-org-issues endpoint (even with valid org ID)", async () => {
            const existingOrgId = 1; // Example organization ID
            const result = await getOrgIssues(existingOrgId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });

        /**
         * @description Ensures that `getOrgIssues` correctly handles the 404 API error
         * from the non-existent `/get-org-issues` endpoint when a non-existent
         * organization ID is used.
         */
        it("should handle API error for non-existent /get-org-issues endpoint (with non-existent org ID)", async () => {
            const nonExistentOrgId = 99921; // An organization ID known not to exist
            const result = await getOrgIssues(nonExistentOrgId);

            expect(result.status).toBe(404);
            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
            expect(result.error).toContain("404 page not found");
        });
    });
});