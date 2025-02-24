import { PUBLIC_PGP, PRIVATE_PGP_KEY } from "../utils/key"
import { encryptPassword, decryptMessage } from "../utils/loginPage.utils"

test("testing encryption and decryption", async () => {

    console.log("Starting encryption...");
    const username = "nikolaylolbut@gmail.com";
    const password = "123niks213!@#";

    const encrypted = await encryptPassword(username, password, PUBLIC_PGP);
    const decrypted = await decryptMessage(encrypted, PRIVATE_PGP_KEY);

    expect(decrypted).toBe(username + password);
});