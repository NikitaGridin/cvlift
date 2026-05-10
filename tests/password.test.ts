import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
  it("verifies the original password and rejects a wrong password", async () => {
    const hash = await hashPassword("correct horse battery staple");

    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });

  it("uses a random salt for each hash", async () => {
    const firstHash = await hashPassword("same password");
    const secondHash = await hashPassword("same password");

    expect(firstHash).not.toBe(secondHash);
    await expect(verifyPassword("same password", firstHash)).resolves.toBe(true);
    await expect(verifyPassword("same password", secondHash)).resolves.toBe(true);
  });

  it("rejects missing or malformed hashes", async () => {
    await expect(verifyPassword("password", null)).resolves.toBe(false);
    await expect(verifyPassword("password", "not-a-valid-hash")).resolves.toBe(false);
    await expect(verifyPassword("password", "scrypt:salt:")).resolves.toBe(false);
  });
});
