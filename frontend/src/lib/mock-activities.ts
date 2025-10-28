import { ActivityCategory, ActivityStatus } from "@/lib/enums/activity";
import { splitTimeRange, toIsoWithOffset } from "@/lib/datetime";

export type ActivityBase = {
  id: string;
  title: string;
  slug?: string;
  status?: ActivityStatus;
  category?: ActivityCategory;
};

export type Activity = ActivityBase & {
  startAt: string; // ISO with offset
  endAt: string;
};

const BASE_EVENTS: ReadonlyArray<ActivityBase & { time: string; fixedDate?: string }> = [
  { id: "cn210", title: "คาบเรียน CN210", time: "13:30-16:30", status: ActivityStatus.Upcoming, slug: "class-cn210", category: ActivityCategory.Academics },
  { id: "firstmeet", title: "กิจกรรมรับน้อง Firstmeet TU-PINE", time: "16:30-18:00", category: ActivityCategory.Socials },
  { id: "secret", title: "กิจกรรมเฉลยสายรหัส", time: "18:00-20:00", category: ActivityCategory.Socials },
  { id: "sai", title: "กิจกรรมรับน้องชมรม SAI", time: "20:00-22:00", status: ActivityStatus.Upcoming, category: ActivityCategory.Socials },
  { id: "gaming-camp", title: "แคมป์เกมมิ่ง", time: "20:30-22:00", status: ActivityStatus.Cancelled, category: ActivityCategory.Recreations },
  { id: "ux-ws", title: "เวิร์กช็อป UX สำหรับนักศึกษา", time: "14:00-15:30", slug: "ux-workshop", category: ActivityCategory.Others },
  { id: "club-booth", title: "บูธสมัครชมรมวิศวกรรม", time: "15:00-16:00", slug: "eng-club-booth", category: ActivityCategory.Socials },
  { id: "hack2025", title: "เปิดรับสมัคร Hackathon 2025", time: "19:00-21:00", slug: "hackathon-2025", category: ActivityCategory.Others },
  { id: "football-0928", title: "การแข่งขันฟุตบอล", time: "10:00-18:00", status: ActivityStatus.Finished, fixedDate: "2025-09-22", category: ActivityCategory.Recreations },
  { id: "music-1129", title: "งานดนตรี", time: "16:00-18:00", status: ActivityStatus.Upcoming, fixedDate: "2025-11-29", category: ActivityCategory.Recreations },
  { id: "market-1129", title: "ตลาดนัดเลียบราง 1", time: "18:30-19:00", status: ActivityStatus.Running, fixedDate: "2025-11-29", category: ActivityCategory.Others },
  { id: "vol-1009", title: "กิจกรรมจิตอาสาทำความสะอาดคณะ", time: "20:20-21:00", status: ActivityStatus.Running, fixedDate: "2025-10-09", category: ActivityCategory.Socials },
  { id: "lab-1011", title: "Open House ห้องแล็บวิจัย", time: "10:00-12:00", status: ActivityStatus.Running, fixedDate: "2025-10-11", category: ActivityCategory.Academics },
  { id: "git-1012", title: "อบรมพื้นฐาน Git & GitHub", time: "13:00-15:00", status: ActivityStatus.Running, fixedDate: "2025-10-12", category: ActivityCategory.Academics },
  { id: "es-1013", title: "แข่งขัน E-Sports ภายในคณะ", time: "17:00-20:00", status: ActivityStatus.Running, fixedDate: "2025-10-30", category: ActivityCategory.Recreations },
  { id: "alumni", title: "สัมมนา Startup กับศิษย์เก่า", time: "16:00-18:00", status: ActivityStatus.Running, fixedDate: "2025-10-30", category: ActivityCategory.Others },
  { id: "movie", title: "Movie Night ที่หอประชุมย่อย", time: "18:30-21:00", status: ActivityStatus.Running, fixedDate: "2025-10-24", category: ActivityCategory.Recreations },
  { id: "mini-1030", title: "Mini Concert ชมรมดนตรี", time: "15:00-21:00", status: ActivityStatus.Running, fixedDate: "2025-10-30", category: ActivityCategory.Recreations },
];

const toYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sameYmd = (iso: string, ymd: string) => iso.startsWith(ymd);

function deriveStatus(now: Date, startAt: string, endAt: string): ActivityStatus {
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  const t = now.getTime();
  if (t < s) return ActivityStatus.Upcoming;
  if (t > e) return ActivityStatus.Finished;
  return ActivityStatus.Running;
}

export function getAllActivities(baseDate = new Date()): Activity[] {
  const todayYmd = toYmd(baseDate);
  return BASE_EVENTS.map((e) => {
    const ymd = e.fixedDate ?? todayYmd;
    const { startHm, endHm } = splitTimeRange(e.time);
    const startAt = toIsoWithOffset(ymd, startHm);
    const endAt = toIsoWithOffset(ymd, endHm);
    return {
      id: e.id,
      title: e.title,
      slug: e.slug,
      category: e.category,
      status: e.status ?? deriveStatus(baseDate, startAt, endAt),
      startAt,
      endAt,
    };
  });
}

export function getActivitiesInMonth(year: number, monthZeroBased: number, baseDate = new Date()): Activity[] {
  return getAllActivities(baseDate).filter((a) => {
    const d = new Date(a.startAt);
    return d.getFullYear() === year && d.getMonth() === monthZeroBased;
  });
}

export function getActivitiesOnDate(ymd: string, baseDate = new Date()): Activity[] {
  return getAllActivities(baseDate).filter((a) => sameYmd(a.startAt, ymd));
}

export function getActivitiesInRange(fromYmd: string, toYmd: string, baseDate = new Date()): Activity[] {
  const items = getAllActivities(baseDate);
  const from = new Date(`${fromYmd}T00:00:00`);
  const to = new Date(`${toYmd}T23:59:59`);
  return items.filter((a) => {
    const s = new Date(a.startAt).getTime();
    return s >= from.getTime() && s <= to.getTime();
  });
}
