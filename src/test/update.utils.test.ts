import { Organization, User } from "../utils/types";
import { updateOrg, updateUser } from "../utils/update.utils"


describe("Update Utility Functions (Integration Tests)", () => {
    jest.setTimeout(30000);

    describe("updateUser", () => {
        let user: User = {
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "avatar.png",
            password: "",
            id: 0,
            verified: false
        }

        it("should update existing user data successfully (status 200)", async () => {
            const result = await updateUser(1, user);
            expect(result).toBe(null);
        });

        it("should handle user not found (status 404, data: {})", async () => {
            const result = await updateUser(-1, user);
            expect(result).toBeInstanceOf(Error);
        });
    });

    describe("updateOrg", () => {
        let org: Organization = {
            id: 1,
            name: "Kamraan is gay",
        }

        it("Should update existing id 1 (status 200)", async () => {
            const result = await updateOrg(160, org);
            expect(result).toBe(null);
        });
    })
});
