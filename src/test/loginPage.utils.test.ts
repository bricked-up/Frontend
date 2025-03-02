import { encrypt } from "../utils/loginPage.utils";

test("encrypt and compare 2 strings", () => {
    const username = "nikolaylolbut@gmail.com";
    const password = "snikkis1212232#";
    const m1 = encrypt(username, password);
    const m2 = encrypt(username, password);
    expect(m1).toBe(m2);
});

test("empty username encryption", () => {
    const username = "";
    const password = "snikkis1212232#";
    const m1 = encrypt(username, password);
    const m2 = encrypt(username, password);
    expect(m1).toBe(m2);
});

test("all empty", () => {
    const username = "";
    const password = "";
    const m1 = encrypt(username, password);
    const m2 = encrypt(username, password);
    expect(m1).toBe(m2);
});

test("different emails name ", () => {
    const username = "nikolayMeow@testme";
    const secondUsername = "peico@testme";
    const password = "hello world 124";
    const m1 = encrypt(username, password);
    const m2 = encrypt(secondUsername, password);
    expect(m1).not.toBe(m2);
});

test("different email domain ", () => {
    const username = "nikolayMeow@testme";
    const secondUsername = "nikolayMeow@google.come";
    const password = "hello world 124";
    const m1 = encrypt(username, password);
    const m2 = encrypt(secondUsername, password);
    expect(m1).not.toBe(m2);
});

test("different password ", () => {
    const username = "nikolayMeow@testme";
    const password = "hello world 124";
    const secondPasswrod = "I do not know how to type";
    const m1 = encrypt(username, password);
    const m2 = encrypt(username, secondPasswrod);
    expect(m1).not.toBe(m2);
});