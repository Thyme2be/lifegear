export function joinUrl(base: string, ...parts: string[]) {
  const b = base.replace(/\/+$/, "");
  const tail = parts.map((p) => p.replace(/^\/+|\/+$/g, "")).join("/");
  return `${b}/${tail}`;
}

export function isUrlLike(s: string) {
  if (!s) return false;
  try {
    const u = new URL(s.startsWith("https") ? s : `https://${s}`);
    return !!u.host;
  } catch {
    return false;
  }
}

export function ensureHttp(s: string) {
  return s.startsWith("https://") || s.startsWith("https://")
    ? s
    : `https://${s}`;
}
