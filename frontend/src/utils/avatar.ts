// src/utils/avatar.ts
import type { User } from "@/types/activities";

/** ดึงอักษรย่อจากชื่อ-สกุล (TH) ถ้าไม่มี ใช้ 2 ตัวแรกของ username, สุดท้าย fallback เป็น "LG" */
export function getInitials(user?: Pick<User, "first_name_th" | "last_name_th" | "username"> | null) {
  const f = (user?.first_name_th || "").trim();
  const l = (user?.last_name_th || "").trim();
  if (f || l) return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();

  const u = (user?.username || "").trim();
  if (u) return u.slice(0, 2).toUpperCase();

  return "LG";
}

/** แปลงสตริงเป็นแฮชแบบง่าย ๆ เพื่อสุ่มคงที่ */
function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** พาเลตต์สีพื้นหลังอวาตาร์ (Tailwind classes) ปรับเพิ่ม/ลดได้ */
export const AVATAR_BG_CLASSES = [
  "bg-rose-600",
  "bg-amber-600",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-indigo-600",
  "bg-fuchsia-600",
  "bg-stone-600",
  "bg-teal-600",
] as const;

/** เลือกสีพื้นหลังจากข้อมูลผู้ใช้แบบ “คงที่” */
export function pickAvatarBg(user?: Pick<User, "first_name_th" | "last_name_th" | "username"> | null) {
  const key = `${user?.username || ""}|${user?.first_name_th || ""}|${user?.last_name_th || ""}` || "lifgear";
  const idx = hashCode(key) % AVATAR_BG_CLASSES.length;
  return AVATAR_BG_CLASSES[idx];
}
