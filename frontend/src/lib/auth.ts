// src/lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
    headers: {
      Cookie: `access_token=${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) redirect("/login");

  const data = await res.json();
  return data.studentId;
}
