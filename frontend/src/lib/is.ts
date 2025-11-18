// src/lib/is.ts

/** ตรวจว่าเป็น string ที่ไม่ว่าง (type guard) */
export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** UUID v4 */
export function isUuidV4(s: unknown): s is string {
  if (!isNonEmptyString(s)) return false;
  const re =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return re.test(s);
}

/** URL http/https */
export function isHttpUrl(s: unknown): s is string {
  if (!isNonEmptyString(s)) return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** ISO 8601 datetime (คร่าว ๆ) */
export function isIsoDateTime(s: unknown): s is string {
  if (!isNonEmptyString(s)) return false;
  const re =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(Z|[+\-]\d{2}:\d{2})$/;
  if (!re.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

/** AbortError guard */
export function isAbortError(e: unknown): e is { name: "AbortError" } {
  return (
    typeof e === "object" &&
    e !== null &&
    "name" in e &&
    (e as { name?: string }).name === "AbortError"
  );
}

/** เดา HTTP status จาก error.message (เข้าคู่ fetcher ที่โยน "HTTP 404 …") */
export function errorIncludesHttp(e: unknown, code: number): e is Error {
  return (
    e instanceof Error &&
    typeof e.message === "string" &&
    e.message.includes(`HTTP ${code}`)
  );
}
