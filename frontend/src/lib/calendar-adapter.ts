// src/lib/calendar-adapter.ts
import type { calendar, classes, activities as ActivityRaw } from "@/types/calendar";
import { CalendarEvent } from "@/types/calendar";


// ✅ รองรับ class_date ที่เป็น "YYYY-MM-DD" หรือ "YYYY-MM-DDTHH:mm:ssZ"
function ymdFromUTC(isoUTC: string) {
  const s = isoUTC.includes("T") ? isoUTC : `${isoUTC}T00:00:00Z`;
  const d = new Date(s);
  if (Number.isNaN(d.valueOf())) return null;
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth() + 1, // 1..12
    day: d.getUTCDate(),
  };
}

// ✅ ประกอบ Asia/Bangkok (+07:00) แบบชัดเจน
function buildThaiIso(y: number, m: number, d: number, hms: string) {
  const Y = String(y).padStart(4, "0");
  const M = String(m).padStart(2, "0");
  const D = String(d).padStart(2, "0");
  return `${Y}-${M}-${D}T${hms}+07:00`;
}

// ✅ ถ้า activity ไม่มี timezone ให้เติม +07:00
function ensureTz(iso: string) {
  if (/Z$|[+-]\d{2}:\d{2}$/.test(iso)) return iso;     // มีโซนแล้ว
  return iso.replace(" ", "T") + "+07:00";             // ไม่มี → เติม +07:00
}

function adaptClass(c: classes): CalendarEvent | null {
  const d = ymdFromUTC(c.class_date);
  if (!d) return null;
  const start_at = buildThaiIso(d.y, d.m, d.day, c.start_time); // +07:00
  const end_at   = buildThaiIso(d.y, d.m, d.day, c.end_time);   // +07:00

  return {
    id: `class-${c.class_code}-${d.y}${String(d.m).padStart(2,"0")}${String(d.day).padStart(2,"0")}-${c.start_time}`,
    title: `${c.class_code} ${c.class_name}`,
    kind: "class",
    start_at,
    end_at,
  };
}

function adaptActivity(a: ActivityRaw, idx: number): CalendarEvent | null {
  if (!a.start_at || !a.end_at) return null;
  return {
    id: `act-${idx}-${a.title}`,
    title: a.title,
    kind: "activity",
    start_at: ensureTz(a.start_at), // ✅ กันไม่มีโซน
    end_at: ensureTz(a.end_at),     // ✅ กันไม่มีโซน
  };
}

export function adaptCalendar(data: calendar): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  for (const c of data.classes) {
    const ev = adaptClass(c);
    if (ev) out.push(ev);
  }
  data.activities?.forEach((a, i) => {
    const ev = adaptActivity(a, i);
    if (ev) out.push(ev);
  });
  return out;
}
