// app/(home)/daily/page.tsx
// ===============================
"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import TimeLabel from "@/components/TimeLabel";
import { useNow } from "@/hooks/useNow";
import {
  toYmdLocal,
  sameDay,
  parseYmd,
  startOfDay,
  getRangeForDate,
  THAI_MONTHS,
} from "@/lib/datetime";
import { getAllActivities } from "@/lib/mock-activities";
import MoreInfoButton from "@/components/MoreInfoButton";
import DeleteButton from "@/components/DeleteButton";
import {
  addRemovedId,
  readRemovedIds,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

/** Display row type */
type Row = {
  id: string;
  slug?: string;
  title: string;
  /** "HH:MM-HH:MM" label only */
  time: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** demo: quick flag */
  isMine: boolean;
};

/** utils */
const formatThaiDate = (d: Date) =>
  `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

export default function DailyPage() {
  const now = useNow(1000);

  // removed ids (shared w/ Monthly via localStorage)
  const [removedIds, setRemovedIds] = useState<string[]>(() => readRemovedIds());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMOVED_IDS_KEY) setRemovedIds(readRemovedIds());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // map mock -> display rows
  const events: Row[] = useMemo(() => {
    const items = getAllActivities(now);
    return items.map((a) => {
      const d = new Date(a.startAt);
      const e = new Date(a.endAt);
      const sh = String(d.getHours()).padStart(2, "0");
      const sm = String(d.getMinutes()).padStart(2, "0");
      const eh = String(e.getHours()).padStart(2, "0");
      const em = String(e.getMinutes()).padStart(2, "0");
      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        time: `${sh}:${sm}-${eh}:${em}`,
        date: toYmdLocal(d),
        // demo logic only
        isMine: a.title.startsWith("คาบเรียน") || a.status === "upcoming",
      } satisfies Row;
    });
  }, [now]);

  // filter out removed
  const visibleEvents = useMemo(
    () => events.filter((ev) => !removedIds.includes(ev.id)),
    [events, removedIds]
  );

  const isRegistered = useCallback((ev: Row) => ev.isMine, []);
  const buildPath = useCallback(
    (e: Row) => (e.slug ? `/activity/${e.slug}` : `/activity/${e.id}`),
    []
  );

  const myToday = useMemo(() => {
    return visibleEvents
      .filter((ev) => sameDay(parseYmd(ev.date), now) && isRegistered(ev))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [visibleEvents, now, isRegistered]);

  const upcomingUnregistered = useMemo(() => {
    const sodNow = startOfDay(now).getTime();
    return visibleEvents
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
      .sort((a, b) =>
        a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
      );
  }, [visibleEvents, now, isRegistered]);

  // delete -> persist & optimistic UI
  const handleDeleteFromMonthlyAndDaily = useCallback((id: string) => {
    addRemovedId(id);
    setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  return (
    <main className="bg-[#f6f1e7] flex flex-col items-center p-6">
      <header className="w-full flex flex-col items-end text-[#730217] mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">ตารางชีวิตประจำวัน</h1>
        <p className="heading font-bold text-xl sm:text-2xl">
          <TimeLabel />
        </p>
      </header>

      <div className="w-full max-w-5xl bg-black rounded-lg p-4">
        <section className="bg-white rounded-md p-6">
          {/* ===== ตารางบน: ของฉัน (วันนี้) ===== */}
          <div className="mb-2 grid grid-cols-[25%_25%_25%_25%] items-center">
            <h2 className="font-bold text-xl sm:text-2xl text-black text-center">กิจกรรมของฉัน</h2>
            <span className="font-bold text-xl sm:text-2xl text-black text-center">กำหนดการ</span>
            <span className="font-bold text-xl sm:text-2xl text-black text-center">ระยะเวลา</span>
            <span className="font-bold text-xl sm:text-2xl text-black text-center">ดำเนินการ</span>
          </div>

          <table className="w-full text-sm table-fixed border-collapse overflow-hidden">
            <tbody>
              {myToday.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={4}>
                    ยังไม่มีกิจกรรมของฉันในวันนี้
                  </td>
                </tr>
              ) : (
                myToday.map((ev, idx) => {
                  const d = parseYmd(ev.date);
                  return (
                    <tr
                      key={ev.id}
                      className={`${idx % 2 === 0 ? "bg-[#FFC26D]" : "bg-[#FF975E]"} hover:brightness-105 transition`}
                    >
                      <td className="p-3 border font-medium text-center">
                        <Link href={buildPath(ev)} className="hover:underline truncate">
                          {ev.title}
                        </Link>
                      </td>
                      <td className="p-3 border text-center">
                        <time>{formatThaiDate(d)}</time>
                      </td>
                      <td className="p-3 border text-center">
                        <time>{ev.time}</time>
                      </td>
                      <td className="p-3 border text-center">
                        <div className="flex items-center justify-center gap-2">
                          <MoreInfoButton href={buildPath(ev)} size="sm" variant="primary" />
                          <DeleteButton
                            activityId={ev.id}
                            onDelete={handleDeleteFromMonthlyAndDaily}
                            size="sm"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* ===== ตารางล่าง: ยังไม่ลงทะเบียน ===== */}
          <div className="w-full mt-10">
            <div className="mb-2 grid grid-cols-[25%_25%_25%_25%] items-center">
              <h2 className="font-bold text-xl sm:text-2xl text-black text-center">กิจกรรมเร็ว ๆ นี้</h2>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">กำหนดการ</span>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">ระยะเวลา</span>
              <span className="font-bold text-xl sm:text-2xl text-black text-center">ดำเนินการ</span>
            </div>

            <table className="w-full text-sm table-fixed border-collapse overflow-hidden">
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead className="sr-only">
                <tr>
                  <th>ชื่อกิจกรรม</th>
                  <th>วัน</th>
                  <th>เวลา</th>
                  <th>ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {upcomingUnregistered.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={4}>
                      ยังไม่มีกิจกรรมที่ยังไม่ได้ลงทะเบียน
                    </td>
                  </tr>
                ) : (
                  upcomingUnregistered.map((ev, idx) => {
                    const d = parseYmd(ev.date);
                    return (
                      <tr
                        key={ev.id}
                        className={`${idx % 2 === 0 ? "bg-[#8BD8FF]" : "bg-[#8CBAFF]"} hover:brightness-105 transition`}
                      >
                        <td className="p-3 border text-center">
                            <Link href={buildPath(ev)} className="hover:underline truncate">
                              {ev.title}
                            </Link>
                        </td>
                        <td className="p-3 border text-center">
                          <time>{formatThaiDate(d)}</time>
                        </td>
                        <td className="p-3 border text-center">
                          <time>{ev.time}</time>
                        </td>
                        <td className="p-3 border text-center">
                          {/* NOTE: avoid nesting interactive elements */}
                          <MoreInfoButton href={buildPath(ev)} size="sm" variant="primary" />
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
