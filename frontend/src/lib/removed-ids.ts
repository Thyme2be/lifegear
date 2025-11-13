// src/lib/removed-ids.ts
const KEY = "lg:removedActivityIds"; // ใช้เป็น REMOVED_IDS_KEY เดิม
export const REMOVED_IDS_KEY = KEY;

// ===== Types =====
export type RemovedEntry = {
  id: string;
  title?: string;
  kind?: "class" | "activity";
  deletedAt: number; // epoch ms
};

// ===== Internal helpers =====
function getStore(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage; // ✅ ใช้ localStorage เพื่อคงอยู่ & ยิง storage event
  } catch {
    return undefined;
  }
}

function readRaw(): unknown {
  const store = getStore();
  if (!store) return null;
  try {
    const raw = store.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRaw(v: unknown) {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(KEY, JSON.stringify(v));
  } catch {
    // ignore
  }
}

// ===== Migration & Normalization =====
function normalize(data: unknown): RemovedEntry[] {
  // เดิมอาจเป็น string[] → แปลงเป็น RemovedEntry[]
  if (Array.isArray(data)) {
    if (data.length === 0) return [];
    if (typeof data[0] === "string") {
      const now = Date.now();
      return (data as string[]).map((id) => ({ id, deletedAt: now }));
    }
    // เผื่อเคสเป็น RemovedEntry[] อยู่แล้ว
    return data as RemovedEntry[];
  }
  return [];
}

// ===== Public API =====
export function readRemovedEntries(): RemovedEntry[] {
  return normalize(readRaw());
}

export function readRemovedIds(): string[] {
  return readRemovedEntries().map((e) => e.id);
}

/** เพิ่มรายการลงถัง (ถ้ามีอยู่แล้วจะอัปเดต title/kind และ timestamp ใหม่) */
export function addRemovedEntry(entry: { id: string; title?: string; kind?: "class" | "activity" }) {
  const list = readRemovedEntries();
  const idx = list.findIndex((e) => e.id === entry.id);
  const now = Date.now();
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry, deletedAt: now };
  } else {
    list.push({ id: entry.id, title: entry.title, kind: entry.kind, deletedAt: now });
  }
  writeRaw(list);
  // ยิง storage event โดยการเขียนค่าซ้ำ (localStorage จะกระจายให้แท็บอื่นด้วย)
}

/** ลบออกจากถังโดย id (ถือว่า "กู้คืน") */
export function removeRemovedId(id: string) {
  const list = readRemovedEntries().filter((e) => e.id !== id);
  writeRaw(list);
}

/** ลบทุกอย่างในถัง */
export function clearRemovedIds() {
  const store = getStore();
  store?.removeItem(KEY);
}

/** ลบรายการที่หมดอายุ (ค่าเริ่มต้น 1 วัน) */
export function purgeExpired(days = 1) {
  const ttlMs = days * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const list = readRemovedEntries().filter((e) => now - e.deletedAt < ttlMs);
  writeRaw(list);
}
