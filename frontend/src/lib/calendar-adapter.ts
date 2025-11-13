// src/lib/calendar-adapter.ts
import type {
  calendar,
  classes,
  activities as ActivityRaw,
} from "@/types/calendar";
import { CalendarEvent } from "@/types/calendar";
import { normalizeIsoToBangkok } from "@/lib/datetime";

// ✅ ตรวจ UUID
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ✅ พยายามหยิบ UUID จาก activity_id ก่อน แล้วค่อย id
function pickUuid(
  a: ActivityRaw & { activity_id?: string; slug?: string | null }
): string | null {
  const cands: Array<string | undefined | null> = [a.activity_id, a.id];
  const hit = cands.find((v) => v && UUID_RE.test(String(v)));
  return hit ?? null;
}

// -------- helpers เดิมของคุณ --------
function ymdFromUTC(isoUTC: string) {
  const s = isoUTC.includes("T") ? isoUTC : `${isoUTC}T00:00:00Z`;
  const d = new Date(s);
  if (Number.isNaN(d.valueOf())) return null;
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}
function buildThaiIso(y: number, m: number, d: number, hms: string) {
  const Y = String(y).padStart(4, "0");
  const M = String(m).padStart(2, "0");
  const D = String(d).padStart(2, "0");
  return `${Y}-${M}-${D}T${hms}+07:00`;
}
function ensureTz(iso: string) {
  return normalizeIsoToBangkok(iso);
}

// -------- adapters --------
function adaptClass(c: classes, rootYmd?: string): CalendarEvent | null {
  const baseYmd: string | undefined = c.class_date ?? rootYmd;
  if (!baseYmd) return null;

  const d = ymdFromUTC(String(baseYmd));
  if (!d) return null;
  if (!c.start_time || !c.end_time) return null;

  const start_at = buildThaiIso(d.y, d.m, d.day, c.start_time);
  const end_at = buildThaiIso(d.y, d.m, d.day, c.end_time);

  return {
    id: `class-${c.class_code ?? "NA"}-${d.y}${String(d.m).padStart(
      2,
      "0"
    )}${String(d.day).padStart(2, "0")}-${c.start_time}`,
    title:
      c.class_code && c.class_name
        ? `[${c.class_code}] ${c.class_name}`
        : c.class_name ?? "Class",
    kind: "class",
    start_at,
    end_at,
  };
}

function adaptActivity(
  a: ActivityRaw & { activity_id?: string; slug?: string | null },
  idx: number
): CalendarEvent | null {
  if (!a?.start_at || !a?.end_at) return null;

  const uuid = pickUuid(a);

  // ถ้าไม่มี UUID ให้ใช้ id ชั่วคราว
  const fallbackId = `tmp-${idx}-${(a.title ?? "activity").slice(
    0,
    24
  )}-${new Date(a.start_at).getTime()}`;

  return {
    id: uuid ?? fallbackId,
    title: a.title ?? "Activity",
    kind: "activity",
    start_at: ensureTz(a.start_at),
    end_at: ensureTz(a.end_at),
  };
}

export function adaptCalendar(data: calendar): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  const rootYmd: string | undefined = data.date;

  for (const c of data.classes ?? []) {
    const ev = adaptClass(c, rootYmd);
    if (ev) out.push(ev);
  }

  (data.activities ?? []).forEach((a, i) => {
    const ev = adaptActivity(a, i);
    if (ev) out.push(ev);
  });

  return out;
}
