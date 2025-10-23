"use client";
import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import TimeLabel from "@/components/TimeLabel";
import { useNow } from "@/hooks/useNow";
import { toYmdLocal, sameDay, parseYmd, startOfDay, getRangeForDate, THAI_MONTHS } from "@/lib/datetime";
import { getAllActivities } from "@/lib/mock-activities";

type Row = {
  id: string;
  slug?: string;
  title: string;
  time: string;       // "HH:MM-HH:MM" for label only
  date: string;       // "YYYY-MM-DD"
  isMine: boolean;    // เดโม่: ใช้ logic ง่าย ๆ
};

export default function DailyPage() {
  const now = useNow(1000);
  const todayStr = useMemo(() => toYmdLocal(now), [now]);

  // แปลงจาก mock (ISO) -> แถวโชว์ (date + time range label)
  const events: Row[] = useMemo(() => {
    const items = getAllActivities(now);
    return items.map((a) => {
      const d = new Date(a.startAt);
      const ymd = toYmdLocal(d);
      const sh = String(d.getHours()).padStart(2, "0");
      const sm = String(d.getMinutes()).padStart(2, "0");
      const e = new Date(a.endAt);
      const eh = String(e.getHours()).padStart(2, "0");
      const em = String(e.getMinutes()).padStart(2, "0");
      const time = `${sh}:${sm}-${eh}:${em}`;
      const isMine = a.title.startsWith("คาบเรียน") || a.status === "upcoming"; // เดโม่
      return { id: a.id, slug: a.slug, title: a.title, time, date: ymd, isMine };
    });
  }, [now]);

  const isRegistered = useCallback((ev: Row) => ev.isMine, []);
  const buildPath = useCallback((e: Row) => (e.slug ? `/activity/${e.slug}` : `/activity/${e.id}`), []);

  const myToday = useMemo(() => {
    return events
      .filter((ev) => sameDay(parseYmd(ev.date), now) && isRegistered(ev))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [events, now, isRegistered]);

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
      .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  }, [events, now, isRegistered]);

  return (
    <main className="bg-[#f6f1e7] flex flex-col items-center p-6">
      <header className="w-full flex flex-col items-end text-[#730217] mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">ตารางกิจกรรมประจำวัน</h1>
        <p className="heading font-bold text-xl sm:text-2xl">
          <TimeLabel />
        </p>
      </header>

      <div className="w-full max-w-5xl bg-black rounded-lg p-4">
        <section className="bg-white rounded-md p-6">
          {/* ตารางบน: ของฉัน */}
          <div className="mb-2 grid grid-cols-[50%_50%] items-center">
            <h2 className="font-bold text-xl sm:text-2xl text-black">กิจกรรมของฉัน</h2>
            <span className="font-bold text-xl sm:text-2xl text-black text-center">ระยะเวลา</span>
          </div>

          <table className="w-full text-sm table-fixed border-collapse overflow-hidden">
            <thead className="sr-only"><tr><th>ชื่อกิจกรรม</th><th>เวลา</th></tr></thead>
            <tbody>
              {myToday.length === 0 ? (
                <tr><td className="p-4 text-center text-gray-500" colSpan={2}>ยังไม่มีกิจกรรมของฉันในวันนี้</td></tr>
              ) : (
                myToday.map((ev, idx) => (
                  <tr key={ev.id} className={`${idx % 2 === 0 ? "bg-[#FFC26D]" : "bg-[#FF975E]"} hover:brightness-105 transition`}>
                    <td className="p-3 border font-medium">
                      <div className="flex justify-between items-center gap-3">
                        <Link href={buildPath(ev)} className="hover:underline truncate">{ev.title}</Link>
                        <Link href={buildPath(ev)} className="shrink-0 whitespace-nowrap bg-[#B30000] text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
                          อ่านเพิ่มเติม
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 border text-center"><time>{ev.time}</time></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ตารางล่าง: ยังไม่ลงทะเบียน */}
          <div className="w-full mt-10">
            <div className="mb-2 grid grid-cols-[50%_25%_25%] items-center">
              <h2 className="font-bold text-xl sm:text-2xl text-black">กิจกรรมเร็ว ๆ นี้</h2>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">กำหนดการ</span>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">ระยะเวลา</span>
            </div>

            <table className="w-full text-sm table-fixed border-collapse overflow-hidden">
              <colgroup><col style={{ width: "50%" }} /><col style={{ width: "25%" }} /><col style={{ width: "25%" }} /></colgroup>
              <thead className="sr-only"><tr><th>ชื่อกิจกรรม</th><th>วัน</th><th>เวลา</th></tr></thead>
              <tbody>
                {upcomingUnregistered.length === 0 ? (
                  <tr><td className="p-4 text-center text-gray-500" colSpan={3}>ยังไม่มีกิจกรรมที่ยังไม่ได้ลงทะเบียน</td></tr>
                ) : (
                  upcomingUnregistered.map((ev, idx) => {
                    const d = parseYmd(ev.date);
                    const dateLabel = `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
                    return (
                      <tr key={ev.id} className={`${idx % 2 === 0 ? "bg-[#8BD8FF]" : "bg-[#8CBAFF]"} hover:brightness-105 transition`}>
                        <td className="p-3 border">
                          <div className="flex justify-between items-center gap-3">
                            <span className="truncate font-medium">{ev.title}</span>
                            <Link href={buildPath(ev)} className="shrink-0 whitespace-nowrap bg-[#B30000] text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
                              อ่านเพิ่มเติม
                            </Link>
                          </div>
                        </td>
                        <td className="p-3 border text-center"><time>{dateLabel}</time></td>
                        <td className="p-3 border text-center"><time>{ev.time}</time></td>
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
