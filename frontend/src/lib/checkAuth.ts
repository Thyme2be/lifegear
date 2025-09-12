// lib/auth.ts
export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch("http://127.0.0.1:8000/v1/api/auth/check", {
      credentials: "include",
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
