import { AuthError } from "next-auth";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { loginWithPassword, registerWithPassword } from "@/app/login/actions";

const mocks = vi.hoisted(() => ({
  AuthError: class AuthError extends Error {},
  createUser: vi.fn(),
  findUniqueUser: vi.fn(),
  hashPassword: vi.fn(),
  signIn: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("next-auth", () => ({
  AuthError: mocks.AuthError,
}));

vi.mock("@/auth", () => ({
  signIn: mocks.signIn,
}));

vi.mock("@/lib/password", () => ({
  hashPassword: mocks.hashPassword,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: mocks.createUser,
      findUnique: mocks.findUniqueUser,
      update: mocks.updateUser,
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();

  mocks.createUser.mockResolvedValue({ id: "user-1" });
  mocks.findUniqueUser.mockResolvedValue(null);
  mocks.hashPassword.mockResolvedValue("hashed-password");
  mocks.signIn.mockResolvedValue(undefined);
  mocks.updateUser.mockResolvedValue({ id: "user-1" });
});

describe("password auth actions", () => {
  test("signs in with normalized email and credentials provider", async () => {
    const result = await loginWithPassword(
      {},
      createFormData({
        email: " User@Example.COM ",
        password: "secret",
      }),
    );

    expect(result).toEqual({});
    expect(mocks.signIn).toHaveBeenCalledWith("credentials", {
      email: "user@example.com",
      password: "secret",
      redirectTo: "/upload",
    });
  });

  test("returns a validation error before sign-in when login email is invalid", async () => {
    const result = await loginWithPassword(
      {},
      createFormData({
        email: "not-email",
        password: "secret",
      }),
    );

    expect(result).toEqual({ error: "Введите корректную почту." });
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  test("returns a safe error message for failed credentials sign-in", async () => {
    mocks.signIn.mockRejectedValue(new AuthError("CredentialsSignin"));

    const result = await loginWithPassword(
      {},
      createFormData({
        email: "user@example.com",
        password: "wrong-password",
      }),
    );

    expect(result).toEqual({ error: "Неверная почта или пароль." });
  });

  test("creates a password account and signs the user in", async () => {
    const result = await registerWithPassword(
      {},
      createFormData({
        name: " Nikita ",
        email: " New@Example.COM ",
        password: "strong-password",
        confirmPassword: "strong-password",
      }),
    );

    expect(result).toEqual({});
    expect(mocks.hashPassword).toHaveBeenCalledWith("strong-password");
    expect(mocks.createUser).toHaveBeenCalledWith({
      data: {
        email: "new@example.com",
        name: "Nikita",
        passwordHash: "hashed-password",
      },
    });
    expect(mocks.signIn).toHaveBeenCalledWith("credentials", {
      email: "new@example.com",
      password: "strong-password",
      redirectTo: "/upload",
    });
  });

  test("attaches a password to an existing OAuth-only account", async () => {
    mocks.findUniqueUser.mockResolvedValue({
      id: "user-1",
      name: "Existing Name",
      passwordHash: null,
    });

    const result = await registerWithPassword(
      {},
      createFormData({
        name: "New Name",
        email: "user@example.com",
        password: "strong-password",
        confirmPassword: "strong-password",
      }),
    );

    expect(result).toEqual({});
    expect(mocks.createUser).not.toHaveBeenCalled();
    expect(mocks.updateUser).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        name: "Existing Name",
        passwordHash: "hashed-password",
      },
    });
  });

  test("rejects registration when the email already has a password account", async () => {
    mocks.findUniqueUser.mockResolvedValue({
      id: "user-1",
      name: "Existing Name",
      passwordHash: "existing-hash",
    });

    const result = await registerWithPassword(
      {},
      createFormData({
        email: "user@example.com",
        password: "strong-password",
        confirmPassword: "strong-password",
      }),
    );

    expect(result).toEqual({
      error: "Аккаунт с такой почтой уже есть. Войдите по паролю.",
    });
    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.createUser).not.toHaveBeenCalled();
    expect(mocks.updateUser).not.toHaveBeenCalled();
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  test("validates registration password confirmation", async () => {
    const result = await registerWithPassword(
      {},
      createFormData({
        email: "user@example.com",
        password: "strong-password",
        confirmPassword: "different-password",
      }),
    );

    expect(result).toEqual({ error: "Пароли не совпадают." });
    expect(mocks.findUniqueUser).not.toHaveBeenCalled();
  });
});

function createFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}
