export function joinUrl(base: string, ...parts: string[]) {
  const b = base.replace(/\/+$/, "");
  const tail = parts.map((p) => p.replace(/^\/+|\/+$/g, "")).join("/");
  return `${b}/${tail}`;
}

export function isUrlLike(s: string) {
  if (!s) return false;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return !!u.host;
  } catch {
    return false;
  }
}

export function ensureHttp(s: string) {
  return s.startsWith("http://") || s.startsWith("https://")
    ? s
    : `https://${s}`;
}
