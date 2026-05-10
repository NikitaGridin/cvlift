import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { PasswordAuthForms } from "@/components/password-auth-forms";
import { getSessionSafely } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Sign in | CVlift",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getSessionSafely();

  if (session?.user?.id) {
    redirect("/upload");
  }

  return (
    <main className="min-h-screen bg-[#050805] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,460px)] lg:items-center">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 rounded-full border border-[#b5ff00]/20 bg-[#b5ff00]/10 px-4 py-2 text-sm font-bold text-[#d9ff62] transition hover:border-[#b5ff00]/45 hover:bg-[#b5ff00]/15"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[#b5ff00] text-[#071007]">
                CV
              </span>
              CVlift
            </Link>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#b5ff00]">
              Личный кабинет
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              Войдите или создайте аккаунт по почте
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/62">
              Используйте email как логин, чтобы сохранять историю анализов, резюме и будущие
              инструменты CVlift в одном профиле.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[460px]">
            <PasswordAuthForms />

            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              <span className="h-px flex-1 bg-white/10" />
              или
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <GoogleSignInButton className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09]">
              Войти через Google
            </GoogleSignInButton>
          </div>
        </section>
      </div>
    </main>
  );
}
