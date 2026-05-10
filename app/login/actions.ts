"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export type PasswordAuthState = {
  error?: string;
};

const emailSchema = z
  .string()
  .trim()
  .email("Введите корректную почту.")
  .max(254, "Почта слишком длинная.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Пароль должен быть не короче 8 символов.")
  .max(128, "Пароль слишком длинный.");

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Введите пароль.").max(128, "Пароль слишком длинный."),
});

const registerSchema = z
  .object({
    name: z.string().trim().max(80, "Имя слишком длинное.").optional(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают.",
  });

export async function loginWithPassword(
  _state: PasswordAuthState,
  formData: FormData,
): Promise<PasswordAuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: getFirstIssue(parsed.error) };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/upload",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Неверная почта или пароль." };
    }

    throw error;
  }

  return {};
}

export async function registerWithPassword(
  _state: PasswordAuthState,
  formData: FormData,
): Promise<PasswordAuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: getFirstIssue(parsed.error) };
  }

  const { email, name, password } = parsed.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser?.passwordHash) {
    return { error: "Аккаунт с такой почтой уже есть. Войдите по паролю." };
  }

  const passwordHash = await hashPassword(password);
  const displayName = name || email.split("@")[0];

  try {
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: existingUser.name || displayName,
          passwordHash,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          name: displayName,
          passwordHash,
        },
      });
    }
  } catch {
    return { error: "Не удалось создать аккаунт. Попробуйте еще раз." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/upload",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Аккаунт создан, но не удалось войти автоматически." };
    }

    throw error;
  }

  return {};
}

function getFirstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Проверьте заполнение формы.";
}
