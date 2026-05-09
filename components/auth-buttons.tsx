import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "@/auth";

type AuthButtonProps = {
  className?: string;
  redirectTo?: string;
  children?: React.ReactNode;
};

export function GoogleSignInButton({
  className,
  redirectTo = "/upload",
  children = "Continue with Google",
}: AuthButtonProps) {
  return (
    <form
      className="contents"
      action={async () => {
        "use server";
        await signIn("google", { redirectTo });
      }}
    >
      <button type="submit" className={className ?? primaryButtonClass}>
        <LogIn aria-hidden="true" className="size-4" />
        {children}
      </button>
    </form>
  );
}

export function SignOutButton({ className, children = "Sign out" }: AuthButtonProps) {
  return (
    <form
      className="contents"
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className={className ?? secondaryButtonClass}>
        <LogOut aria-hidden="true" className="size-4" />
        {children}
      </button>
    </form>
  );
}

const primaryButtonClass =
  "inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#6366F1] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(99,102,241,0.26)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#4F46E5]";

const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-4 text-sm font-semibold text-[#0F172A] shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white";
