// lib/auth.ts
export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/auth/check`, {
      credentials: "include",
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
