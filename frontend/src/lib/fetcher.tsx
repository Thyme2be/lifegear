// src/lib/fetcher.ts
export async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    // ถ้าใช้คุกกี้/เซสชันจาก backend
    credentials: "include",
    ...init,
    headers: {
      "Accept": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text || url}`);
  }
  return (await res.json()) as T;
}
