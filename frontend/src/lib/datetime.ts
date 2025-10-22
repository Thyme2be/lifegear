// src/lib/datetime.ts
export const THAI_MONTHS = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
] as const;

export const THAI_DAYS = [
  "อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์",
] as const;

export const pad2 = (n: number) => `${n}`.padStart(2, "0");

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
  `${THAI_DAYS[d.getDay()]} ${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

export const startMinutes = (timeRange: string): number => {
  const [s] = timeRange.split("-");
  const [hh, mm] = (s ?? "00:00").split(":").map(Number);
  return (hh ?? 0) * 60 + (mm ?? 0);
};
