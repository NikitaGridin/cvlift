"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import {
  loginWithPassword,
  registerWithPassword,
  type PasswordAuthState,
} from "@/app/login/actions";
import { useI18n } from "@/components/preferences-provider";

const initialState: PasswordAuthState = {};

export function PasswordAuthForms() {
  const { locale } = useI18n();
  const copy = getCopy(locale);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginState, loginAction, isLoginPending] = useActionState(
    loginWithPassword,
    initialState,
  );
  const [registerState, registerAction, isRegisterPending] = useActionState(
    registerWithPassword,
    initialState,
  );

  const isRegister = mode === "register";
  const activeState = isRegister ? registerState : loginState;
  const isPending = isRegister ? isRegisterPending : isLoginPending;
  const passwordType = isPasswordVisible ? "text" : "password";

  return (
    <div className="w-full max-w-[460px] rounded-[28px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="grid grid-cols-2 rounded-[22px] bg-black/25 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={getTabClass(!isRegister)}
        >
          {copy.loginTab}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={getTabClass(isRegister)}
        >
          {copy.registerTab}
        </button>
      </div>

      <form action={isRegister ? registerAction : loginAction} className="space-y-4 p-5">
        {isRegister ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-white/72">{copy.name}</span>
            <span className="flex h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 text-white transition focus-within:border-[#b5ff00]/60 focus-within:bg-black/35">
              <UserRound aria-hidden="true" className="size-5 text-[#b5ff00]" />
              <input
                name="name"
                type="text"
                autoComplete="name"
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-white/35"
                placeholder={copy.namePlaceholder}
              />
            </span>
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white/72">{copy.email}</span>
          <span className="flex h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 text-white transition focus-within:border-[#b5ff00]/60 focus-within:bg-black/35">
            <Mail aria-hidden="true" className="size-5 text-[#b5ff00]" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-white/35"
              placeholder="mail@example.com"
            />
          </span>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white/72">{copy.password}</span>
          <span className="flex h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 text-white transition focus-within:border-[#b5ff00]/60 focus-within:bg-black/35">
            <Lock aria-hidden="true" className="size-5 text-[#b5ff00]" />
            <input
              name="password"
              type={passwordType}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-white/35"
              placeholder={isRegister ? copy.passwordPlaceholder : copy.password}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((value) => !value)}
              className="grid size-9 place-items-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
              aria-label={isPasswordVisible ? copy.hidePassword : copy.showPassword}
            >
              {isPasswordVisible ? (
                <EyeOff aria-hidden="true" className="size-4" />
              ) : (
                <Eye aria-hidden="true" className="size-4" />
              )}
            </button>
          </span>
        </label>

        {isRegister ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-white/72">{copy.confirmPassword}</span>
            <span className="flex h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 text-white transition focus-within:border-[#b5ff00]/60 focus-within:bg-black/35">
              <Lock aria-hidden="true" className="size-5 text-[#b5ff00]" />
              <input
                name="confirmPassword"
                type={passwordType}
                required
                autoComplete="new-password"
                minLength={8}
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-white/35"
                placeholder={copy.confirmPassword}
              />
            </span>
          </label>
        ) : null}

        {activeState.error ? (
          <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
            {activeState.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#b5ff00] px-5 text-base font-bold text-[#071007] shadow-[0_16px_46px_rgba(181,255,0,0.26)] transition hover:-translate-y-0.5 hover:bg-[#ccff2e] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? copy.pending : isRegister ? copy.registerSubmit : copy.loginSubmit}
        </button>
      </form>
    </div>
  );
}

function getTabClass(isActive: boolean) {
  return [
    "h-11 rounded-[18px] text-sm font-bold transition",
    isActive
      ? "bg-[#b5ff00] text-[#071007] shadow-[0_12px_32px_rgba(181,255,0,0.18)]"
      : "text-white/55 hover:bg-white/5 hover:text-white",
  ].join(" ");
}

function getCopy(locale: string) {
  if (locale === "ru") {
    return {
      loginTab: "Вход",
      registerTab: "Регистрация",
      name: "Имя",
      namePlaceholder: "Как к вам обращаться",
      email: "Почта",
      password: "Пароль",
      passwordPlaceholder: "Минимум 8 символов",
      confirmPassword: "Повторите пароль",
      showPassword: "Показать пароль",
      hidePassword: "Скрыть пароль",
      loginSubmit: "Войти",
      registerSubmit: "Создать аккаунт",
      pending: "Отправляем...",
    };
  }

  return {
    loginTab: "Sign in",
    registerTab: "Sign up",
    name: "Name",
    namePlaceholder: "How should we call you",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPassword: "Confirm password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    loginSubmit: "Sign in",
    registerSubmit: "Create account",
    pending: "Submitting...",
  };
}
