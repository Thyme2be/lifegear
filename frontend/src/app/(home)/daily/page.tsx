"use client";
import React, { useEffect, useMemo, useCallback, useState } from "react";
import Link from "next/link";
import TimeLabel from "@/components/TimeLabel";
import {
  // utils (no React)
  toYmdLocal,
  sameDay,
  parseYmd,
  startMinutes,
  startOfDay,
  getRangeForDate,
  THAI_MONTHS, // สำหรับป้ายวันไทยด้านล่าง
} from "@/lib/datetime";

type Event = {
  id: string;
  slug?: string;
  title: string;
  /** "HH:MM-HH:MM" */
  time: string;
  status?: "เข้าร่วม" | string;
  /** YYYY-MM-DD (local) */
  date: string;
};

/** เรียงตาม "เวลาเริ่ม" (นาที) */
const compareByStartTime = (a: Event, b: Event) =>
  startMinutes(a.time) - startMinutes(b.time);

/** เรียงตามวัน (ASC) แล้วเวลาเริ่ม (ASC) */
const compareByDateThenTime = (a: Event, b: Event) => {
  const da = parseYmd(a.date).getTime();
  const db = parseYmd(b.date).getTime();
  if (da !== db) return da - db;
  return compareByStartTime(a, b);
};

/* ======================== Data (mock) ======================== */
const BASE_EVENTS: Omit<Event, "date">[] = [
  { id: "cn210", title: "คาบเรียน CN210", time: "13:30-16:30", status: "เข้าร่วม", slug: "class-cn210" },
  { id: "firstmeet", title: "กิจกรรมรับน้อง Firstmeet TU-PINE", time: "16:30-18:00" },
  { id: "secret", title: "กิจกรรมเฉลยสายรหัส", time: "18:00-20:00" },
  { id: "sai", title: "กิจกรรมรับน้องชมรม SAI", time: "20:00-22:00", status: "เข้าร่วม" },
  { id: "gaming-camp", title: "แคมป์เกมมิ่ง", time: "20:30-22:00", status: "เข้าร่วม" },
  { id: "ux-ws", title: "เวิร์กช็อป UX สำหรับนักศึกษา", time: "14:00-15:30", slug: "ux-workshop" },
  { id: "club-booth", title: "บูธสมัครชมรมวิศวกรรม", time: "15:00-16:00", slug: "eng-club-booth" },
  { id: "hack2025", title: "เปิดรับสมัคร Hackathon 2025", time: "19:00-21:00", slug: "hackathon-2025" },
  { id: "football-0928", title: "การแข่งขันฟุตบอล", time: "10:00-18:00", status: "เข้าร่วม" },
  { id: "music-1129", title: "งานดนตรี", time: "16:00-18:00", status: "เข้าร่วม" },
  { id: "market-1129", title: "ตลาดนัดเลียบราง 1", time: "18:30-19:00", status: "เข้าร่วม" },
  { id: "vol-1009", title: "กิจกรรมจิตอาสาทำความสะอาดคณะ", time: "20:20-21:00" },
  { id: "lab-1011", title: "Open House ห้องแล็บวิจัย", time: "10:00-12:00" },
  { id: "git-1012", title: "อบรมพื้นฐาน Git & GitHub", time: "13:00-15:00" },
  { id: "es-1013", title: "แข่งขัน E-Sports ภายในคณะ", time: "17:00-20:00" },
  { id: "alumni", title: "สัมมนา Startup กับศิษย์เก่า", time: "16:00-18:00" },
  { id: "movie", title: "Movie Night ที่หอประชุมย่อย", time: "18:30-21:00" },
  { id: "mini-1030", title: "Mini Concert ชมรมดนตรี", time: "15:00-21:00" },
];

const FIXED_DATE_BY_ID: Record<string, string> = {
  "football-0928": "2025-09-22",
  "music-1129": "2025-11-29",
  "market-1129": "2025-11-29",
  "vol-1009": "2025-10-09",
  "lab-1011": "2025-10-11",
  "git-1012": "2025-10-12",
  "es-1013": "2025-10-30",
  "alumni": "2025-10-30",
  "movie": "2025-10-24",
  "mini-1030": "2025-10-30",
};

export default function DailyPage() {
  // นาฬิกา real-time (ถ้าจะใช้ TimeLabel อย่างเดียว สามารถลบท่อนนี้ได้)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayStr = useMemo(() => toYmdLocal(now), [now]);

  // สร้าง events แบบ deterministic
  const events: Event[] = useMemo(
    () =>
      BASE_EVENTS.map((e) => ({
        ...e,
        date: FIXED_DATE_BY_ID[e.id] ?? todayStr,
      })),
    [todayStr]
  );

  const isRegistered = useCallback(
    (ev: Event) => ev.status === "เข้าร่วม" || ev.title.startsWith("คาบเรียน"),
    []
  );

  // ตารางบน
  const myTodayEvents = useMemo(() => {
    return events
      .filter((ev) => sameDay(parseYmd(ev.date), now) && isRegistered(ev))
      .sort(compareByStartTime);
  }, [events, now, isRegistered]);

  // ตารางล่าง
  const upcomingUnregistered = useMemo(() => {
    const sodNow = startOfDay(now).getTime();
    return events
      .filter((ev) => {
        if (isRegistered(ev)) return false;
        const d = parseYmd(ev.date);
        const isToday = sameDay(d, now);
        const isAfterToday = d.getTime() > sodNow;
        if (isAfterToday) return true;
        if (!isToday) return false;
        const { start } = getRangeForDate(ev.date, ev.time, now);
        return start.getTime() > now.getTime();
      })
      .sort(compareByDateThenTime);
  }, [events, now, isRegistered]);

  const buildPath = useCallback(
    (e: Event) => (e.slug ? `/activity/${e.slug}` : `/activity/${e.id}`),
    []
  );

  return (
    <main className="bg-[#f6f1e7] flex flex-col items-center p-6">
      <header className="w-full flex flex-col items-end text-[#730217] mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">ตารางกิจกรรมประจำวัน</h1>

        {/* ใช้คอมโพเนนต์กลาง */}
        <p className="heading font-bold text-xl sm:text-2xl">
          <TimeLabel />
        </p>
      </header>

      <div className="w-full max-w-5xl bg-black rounded-lg p-4">
        <section className="bg-white rounded-md p-6">
          {/* ========= ตารางบน ========= */}
          <div className="mb-2 grid grid-cols-[65%_35%] items-center">
            <h2 className="font-bold text-xl sm:text-2xl text-black">กิจกรรมของฉัน</h2>
            <span className="font-bold text-xl sm:text-2xl text-black text-center">ระยะเวลา</span>
          </div>

          <table className="w-full text-sm table-fixed border-collapse overflow-hidden">
            <colgroup>
              <col style={{ width: "65%" }} />
              <col style={{ width: "35%" }} />
            </colgroup>
            <thead className="sr-only">
              <tr><th>ชื่อกิจกรรม</th><th>เวลา</th></tr>
            </thead>
            <tbody>
              {myTodayEvents.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={2}>
                    ยังไม่มีกิจกรรมของฉันในวันนี้
                  </td>
                </tr>
              ) : (
                myTodayEvents.map((ev, idx) => (
                  <tr
                    key={ev.id}
                    className={`${idx % 2 === 0 ? "bg-[#FFC26D]" : "bg-[#FF975E]"} hover:brightness-105 transition`}
                  >
                    <td className="p-3 border font-medium">
                      <Link href={buildPath(ev)} className="hover:underline">
                        {ev.title}
                      </Link>
                    </td>
                    <td className="p-3 border text-center">
                      <time aria-label={`ช่วงเวลา ${ev.time}`}>{ev.time}</time>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ========= ตารางล่าง ========= */}
          <div className="w-full mt-10">
            <div className="mb-2 grid grid-cols-[50%_25%_25%] items-center">
              <h2 className="font-bold text-xl sm:text-2xl text-black">กิจกรรมเร็ว ๆ นี้</h2>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">กำหนดการ</span>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">ระยะเวลา</span>
            </div>

            <table className="w-full text-sm table-fixed border-collapse overflow-hidden">
              <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead className="sr-only">
                <tr><th>ชื่อกิจกรรม</th><th>วัน</th><th>เวลา</th></tr>
              </thead>
              <tbody>
                {upcomingUnregistered.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={3}>
                      ยังไม่มีกิจกรรมที่ยังไม่ได้ลงทะเบียน
                    </td>
                  </tr>
                ) : (
                  upcomingUnregistered.map((ev, idx) => {
                    const d = parseYmd(ev.date);
                    const dateLabel = `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
                    return (
                      <tr
                        key={ev.id}
                        className={`${idx % 2 === 0 ? "bg-[#8BD8FF]" : "bg-[#8CBAFF]"} hover:brightness-105 transition`}
                      >
                        <td className="p-3 border">
                          <div className="flex justify-between items-center gap-3">
                            <span className="truncate font-medium">{ev.title}</span>
                            <Link
                              href={buildPath(ev)}
                              className="shrink-0 whitespace-nowrap bg-[#B30000] text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                            >
                              อ่านเพิ่มเติม
                            </Link>
                          </div>
                        </td>
                        <td className="p-3 border text-center">
                          <time aria-label={`วันที่ ${dateLabel}`}>{dateLabel}</time>
                        </td>
                        <td className="p-3 border text-center">
                          <time aria-label={`ช่วงเวลา ${ev.time}`}>{ev.time}</time>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
