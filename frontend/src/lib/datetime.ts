// src/lib/datetime.ts

export const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
] as const;

export const THAI_DAYS = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
] as const;

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const toYmdLocal = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const parseYmd = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
};

export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const sameDay = (a: Date, b: Date) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

export const getRangeForDate = (
  dateYmd: string,
  range: string,
  now: Date
): { start: Date; end: Date } => {
  try {
    const [s, e] = range.split("-");
    const [sh, sm] = (s ?? "00:00").split(":").map(Number);
    const [eh, em] = (e ?? "00:00").split(":").map(Number);
    const day = parseYmd(dateYmd);
    const start = new Date(day);
    const end = new Date(day);
    start.setHours(sh ?? 0, sm ?? 0, 0, 0);
    end.setHours(eh ?? 0, em ?? 0, 0, 0);
    return { start, end };
  } catch {
    const far = new Date(now.getTime() + 1e12);
    return { start: far, end: far };
  }
};

export const formatThaiDateLabel = (d: Date) =>
  `${THAI_DAYS[d.getDay()]} ${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${
    d.getFullYear() + 543
  }`;

export const startMinutes = (timeRange: string): number => {
  const [s] = timeRange.split("-");
  const [hh, mm] = (s ?? "00:00").split(":").map(Number);
  return (hh ?? 0) * 60 + (mm ?? 0);
};

export const splitTimeRange = (range: string) => {
  if (!range || !range.includes("-"))
    return { startHm: "00:00", endHm: "00:00" };
  const [s, e] = range.split("-");
  const norm = (hm?: string) =>
    /^\d{2}:\d{2}$/.test(hm ?? "") ? (hm as string) : "00:00";
  return { startHm: norm(s), endHm: norm(e) };
};

export const toIsoWithOffset = (ymd: string, hm: string, tz = "+07:00") =>
  `${ymd}T${hm}:00${tz}`;

export const toBuddhistYmd = (d: Date) =>
  `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

export const formatThaiDate = (d: Date, withTime = false) => {
  const date = `${THAI_DAYS[d.getDay()]} ${d.getDate()} ${
    THAI_MONTHS[d.getMonth()]
  } ${d.getFullYear() + 543}`;
  if (!withTime) return date;
  const time = d.toLocaleTimeString("th-TH", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date} • ${time}`;
};

export const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const compareByStartTimeRange = (
  aTimeRange: string,
  bTimeRange: string
) => startMinutes(aTimeRange) - startMinutes(bTimeRange);

export const compareByIsoStart = (aIso: string, bIso: string) =>
  new Date(aIso).getTime() - new Date(bIso).getTime();

export const formatDateThaiFromIso = (iso?: string | null) => {
  if (!iso) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dt);
};

export const formatTimeThaiFromIso = (iso?: string | null) => {
  if (!iso) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return (
    new Intl.DateTimeFormat("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dt) + " น."
  );
};

/**
 * สร้างกริดปฏิทินของเดือนที่ระบุ
 * @param year  ค.ศ. เช่น 2025
 * @param month index แบบ JS (0=ม.ค., 11=ธ.ค.)
 * @param options.weekStartsOn  0=อาทิตย์, 1=จันทร์ (ค่าเริ่มต้น: 1 = จันทร์)
 * @returns array ของตัวเลขวันที่ (1..n) คั่นด้วย null ตำแหน่งก่อนวันแรก
 */
export function generateCalendarGrid(
  year: number,
  month: number,
  options: { weekStartsOn?: 0 | 1 } = {}
) {
  const weekStartsOn = options.weekStartsOn ?? 1; // Monday-first เป็นดีฟอลต์
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // ถ้าเริ่มวันจันทร์ ให้ปรับ offset จากค่า getDay()
  const offset = weekStartsOn === 1 ? (firstDay + 6) % 7 : firstDay;

  const grid: (number | null)[] = [];
  for (let i = 0; i < offset; i++) grid.push(null);
  for (let day = 1; day <= daysInMonth; day++) grid.push(day);
  return grid;
}

export type YMD0 = { y: number; m0: number; d: number }; // m0 = 0..11

// ✅ เพิ่ม helper: ถ้าไม่มี timezone ให้ถือเป็น Bangkok (+07:00)
function ensureBangkokIso(iso: string) {
  // 2025-11-04T10:20:00 หรือ 2025-11-04 10:20:00  (ไม่มี Z/±hh:mm)
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}$/.test(iso)) {
    return iso.replace(" ", "T") + "+07:00";
  }
  return iso;
}

export function ymdInBangkok(iso?: string | null): YMD0 | null {
  if (!iso || typeof iso !== "string") return null;
  const dt = new Date(ensureBangkokIso(iso)); // ✅ ใช้ helper
  if (Number.isNaN(dt.valueOf())) return null;

  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(dt);
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value;

  const y = Number(get("year"));
  const m = Number(get("month"));
  const d = Number(get("day"));
  if (!y || !m || !d) return null;

  return { y, m0: m - 1, d };
}
