import { apiRoutes } from "./apiRoutes";

// lib/auth.ts
export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(apiRoutes.getUserCheck, {
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}
