import { redirect } from "next/navigation";
import { getSessionSafely } from "@/lib/server-data";

export async function requireUserSession() {
  const session = await getSessionSafely();

  if (!session?.user?.id) {
    redirect("/");
  }

  return session;
}
