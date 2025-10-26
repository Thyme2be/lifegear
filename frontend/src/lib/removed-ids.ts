const KEY = "lg:removedActivityIds";
// เปลี่ยนเป็น localStorage ได้เพื่อคงหลังปิดเบราว์เซอร์
const storage = typeof window !== "undefined" ? window.sessionStorage : undefined;

export function readRemovedIds(): string[] {
  try {
    const raw = storage?.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
export function addRemovedId(id: string) {
  const arr = readRemovedIds();
  if (!arr.includes(id)) {
    storage?.setItem(KEY, JSON.stringify([...arr, id]));
  }
}
export function removeRemovedId(id: string) {
  const arr = readRemovedIds().filter((x) => x !== id);
  storage?.setItem(KEY, JSON.stringify(arr));
}
export function clearRemovedIds() {
  storage?.removeItem(KEY);
}
export const REMOVED_IDS_KEY = KEY;
