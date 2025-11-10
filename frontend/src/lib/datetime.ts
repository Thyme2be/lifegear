// src/lib/datetime.ts

export const THAI_MONTHS = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
] as const;

export const THAI_DAYS = [
  "อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์",
] as const;

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const toYmdLocal = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/* =================== ISO Normalizer (Bangkok) =================== */
// รองรับเคสไม่มี timezone/ไม่มีวินาที/มีช่องว่าง ให้ตีความเป็น Asia/Bangkok (+07:00)
const ISO_NO_TZ_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/;
const HAS_TZ_RE = /([Zz]|[+\-]\d{2}:\d{2})$/;

export function normalizeIsoToBangkok(iso: string, tz = "+07:00"): string {
  let s = (iso ?? "").trim().replace(" ", "T");
  if (!HAS_TZ_RE.test(s)) {
    if (ISO_NO_TZ_RE.test(s)) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ":00";
      s += tz;
    }
  }
  return s;
}

/* =================== Formatters (cache ระดับโมดูล) =================== */
const FMT_TH_DATE = new Intl.DateTimeFormat("th-TH", {
  timeZone: "Asia/Bangkok",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const FMT_TH_TIME = new Intl.DateTimeFormat("th-TH", {
  timeZone: "Asia/Bangkok",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const FMT_EN_GB_YMD = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/* =================== Basic date helpers =================== */

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

export const parseYmd = (ymd: string) => {
  const s = (ymd ?? "").trim();
  if (!YMD_RE.test(s)) return new Date(NaN);
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};

export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

export const sameDay = (a: Date, b: Date) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

export const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const clampToDayRange = (start: Date, end: Date, day: Date) => {
  const s = startOfDay(day).getTime();
  const e = endOfDay(day).getTime();
  const S = Math.max(start.getTime(), s);
  const E = Math.min(end.getTime(), e);
  return { start: new Date(S), end: new Date(E) };
};

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

/* =================== Time range helpers =================== */

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

/* =================== Thai/Buddhist date formats =================== */

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

export const formatDateThaiFromIso = (iso?: string | null) => {
  if (!iso) return null;
  const dt = new Date(normalizeIsoToBangkok(iso));
  if (Number.isNaN(dt.getTime())) return null;
  return FMT_TH_DATE.format(dt);
};

export const formatTimeThaiFromIso = (iso?: string | null) => {
  if (!iso) return null;
  const dt = new Date(normalizeIsoToBangkok(iso));
  if (Number.isNaN(dt.getTime())) return null;
  return FMT_TH_TIME.format(dt) + " น.";
};

/* =================== Compare helpers =================== */

export const compareByStartTimeRange = (
  aTimeRange: string,
  bTimeRange: string
) => startMinutes(aTimeRange) - startMinutes(bTimeRange);

export const compareByIsoStart = (aIso: string, bIso: string) =>
  new Date(normalizeIsoToBangkok(aIso)).getTime() -
  new Date(normalizeIsoToBangkok(bIso)).getTime();

export const compareByIsoEnd = (aIso: string, bIso: string) =>
  new Date(normalizeIsoToBangkok(aIso)).getTime() -
  new Date(normalizeIsoToBangkok(bIso)).getTime();

/* =================== Calendar grid =================== */
/**
 * สร้างกริดปฏิทินของเดือนที่ระบุ
 * @param year  ค.ศ. เช่น 2025
 * @param month index แบบ JS (0=ม.ค., 11=ธ.ค.)
 * @param options.weekStartsOn  0=อาทิตย์, 1=จันทร์ (ค่าเริ่มต้น: 1 = จันทร์)
 * @param options.padTo6Weeks เติม null ให้ครบ 42 ช่อง (7x6) เพื่อ UI สม่ำเสมอ
 * @returns array ของตัวเลขวันที่ (1..n) คั่นด้วย null ตำแหน่งก่อนวันแรก
 */
export function generateCalendarGrid(
  year: number,
  month: number,
  options: { weekStartsOn?: 0 | 1; padTo6Weeks?: boolean } = {}
) {
  const weekStartsOn = options.weekStartsOn ?? 1; // Monday-first เป็นดีฟอลต์
  const padTo6Weeks = options.padTo6Weeks ?? false;

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // ถ้าเริ่มวันจันทร์ ให้ปรับ offset จากค่า getDay()
  const offset = weekStartsOn === 1 ? (firstDay + 6) % 7 : firstDay;

  const grid: (number | null)[] = [];
  for (let i = 0; i < offset; i++) grid.push(null);
  for (let day = 1; day <= daysInMonth; day++) grid.push(day);

  if (padTo6Weeks) {
    const target = 42; // 7 cols * 6 rows
    while (grid.length < target) grid.push(null);
  }
  return grid;
}

export type YMD0 = { y: number; m0: number; d: number }; // m0 = 0..11

// คืน {y, m0, d} ของเวลาจาก ISO ในเขต Asia/Bangkok
export function ymdInBangkok(iso?: string | null): YMD0 | null {
  if (!iso || typeof iso !== "string") return null;
  const dt = new Date(normalizeIsoToBangkok(iso));
  if (Number.isNaN(dt.valueOf())) return null;

  const parts = FMT_EN_GB_YMD.formatToParts(dt);
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value;

  const y = Number(get("year"));
  const m = Number(get("month"));
  const d = Number(get("day"));
  if (!y || !m || !d) return null;

  return { y, m0: m - 1, d };
}

/* =================== Convenience helpers (ย้ายจาก utils/time.ts) =================== */

export function toHm(iso: string): string {
  const t = new Date(normalizeIsoToBangkok(iso));
  if (Number.isNaN(t.valueOf())) return "—";
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function safeRangeHm(startISO: string, endISO?: string | null): string {
  const start = new Date(normalizeIsoToBangkok(startISO));
  const end = endISO ? new Date(normalizeIsoToBangkok(endISO)) : null;
  if (Number.isNaN(start.valueOf())) return "—";
  if (end && !Number.isNaN(end.valueOf())) return `${toHm(startISO)}-${toHm(endISO!)}`;
  return `${toHm(startISO)}-—`;
}

export function ymdFromISO(iso: string) {
  return toYmdLocal(new Date(normalizeIsoToBangkok(iso)));
}

export function formatThaiRangeFromISO(startISO: string, endISO: string) {
  const s = new Date(normalizeIsoToBangkok(startISO));
  const e = new Date(normalizeIsoToBangkok(endISO));
  if (Number.isNaN(s.valueOf()) || Number.isNaN(e.valueOf())) return "—";

  const sd = s.getDate();
  const sm = THAI_MONTHS[s.getMonth()];
  const sy = s.getFullYear() + 543;
  const ed = e.getDate();
  const em = THAI_MONTHS[e.getMonth()];
  const ey = e.getFullYear() + 543;

  const sameMonth = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
  return sameMonth ? `${sd}–${ed} ${sm} ${sy}` : `${sd} ${sm} ${sy} – ${ed} ${em} ${ey}`;
}
