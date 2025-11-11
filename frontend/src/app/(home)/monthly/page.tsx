// app/(home)/monthly/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import {
  generateCalendarGrid,
  THAI_MONTHS,
  ymdInBangkok,
} from "@/lib/datetime";
import {
  readRemovedIds,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

import IconButton from "@/components/IconButton";
import CalendarCard from "@/components/CalendarCard";
import MonthEventList from "@/components/CalendarEventList";
import { apiRoutes } from "@/lib/apiRoutes";
import { useMonthlyEvents } from "@/hooks/useMonthlyEvents";
import type { CalendarEvent } from "@/types/calendar";

/* =============== Helpers =============== */
function sameYmd(a: Date, y: number, m0: number, d: number) {
  return a.getFullYear() === y && a.getMonth() === m0 && a.getDate() === d;
}
function getInitialSelectedDay(today: Date, y: number, m0: number) {
  return sameYmd(today, y, m0, today.getDate()) ? today.getDate() : null;
}

/** กระจายกิจกรรมตามช่วง start–end ให้ลงทุกวันในเดือนนั้น (inclusive) */
function buildEventsByDayForMonthRange(
  events: CalendarEvent[],
  year: number,
  month0: number
) {
  const map: Record<number, CalendarEvent[]> = {};

  for (const ev of events) {
    if (!ev.start_at || !ev.end_at) continue;

    const s = ymdInBangkok(ev.start_at);
    const e = ymdInBangkok(ev.end_at);
    if (!s || !e) continue;

    let cur = new Date(s.y, s.m0, s.d);
    const end = new Date(e.y, e.m0, e.d);

    while (cur.getTime() <= end.getTime()) {
      const cy = cur.getFullYear();
      const cm0 = cur.getMonth();
      const cd = cur.getDate();

      if (cy === year && cm0 === month0) {
        (map[cd] ??= []).push(ev);
      }
      cur = new Date(cy, cm0, cd + 1);
    }
  }

  // sort: class ก่อน activity แล้วตามเวลาเริ่ม
  for (const d in map) {
    map[d].sort((a, b) => {
      const ak = a.kind === "class" ? 0 : 1;
      const bk = b.kind === "class" ? 0 : 1;
      if (ak !== bk) return ak - bk;
      const at = new Date(a.start_at).getTime();
      const bt = new Date(b.start_at).getTime();
      if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
      if (Number.isNaN(at)) return 1;
      if (Number.isNaN(bt)) return -1;
      return at - bt;
    });
  }
  return map;
}

/* =============== Page =============== */
export default function MonthlyPage() {
  // today (คงค่าตลอด Lifecycle)
  const todayRef = useRef(new Date());

  // anchor: วันแรกของเดือน (ควบคุมเดือน/ปี)
  const [anchorDate, setAnchorDate] = useState<Date>(() => {
    const t = todayRef.current;
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const { year, month: month0 } = useMemo(
    () => ({ year: anchorDate.getFullYear(), month: anchorDate.getMonth() }),
    [anchorDate]
  );

  // รีเฟรชเมื่อมีการ Add จากที่อื่น
  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    const handler = () => setRefreshTick((k) => k + 1);
    window.addEventListener("lifgear:activity-added", handler);
    return () => window.removeEventListener("lifgear:activity-added", handler);
  }, []);

  // Recycle bin state
  const [removedIds, setRemovedIds] = useState<string[]>(() =>
    readRemovedIds()
  );
  // selected day (default: วันนี้ถ้าอยู่เดือนเดียวกัน)
  const [selectedDay, setSelectedDay] = useState<number | null>(() =>
    getInitialSelectedDay(todayRef.current, year, month0)
  );
  useEffect(() => {
    setSelectedDay(getInitialSelectedDay(todayRef.current, year, month0));
  }, [year, month0]);

  // sync removedIds จาก tab อื่น
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMOVED_IDS_KEY) setRemovedIds(readRemovedIds());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Calendar grid
  const calendar = useMemo(
    () => generateCalendarGrid(year, month0, { weekStartsOn: 1 }),
    [year, month0]
  );

  // ==== เรียก API รูปแบบใหม่: baseapi/calendar/monthly/YYYY-MM-DD (ส่งวันแรกของเดือน) ====
  const firstYmd = `${year}-${String(month0 + 1).padStart(2, "0")}-01`;
  const url = `${apiRoutes.getMyMonthlyEvents}/${firstYmd}?rt=${refreshTick}`;

  const { loading, error, events } = useMonthlyEvents(year, month0, url);

  // ซ่อนรายการที่ถูกลบ
  const visibleEvents = useMemo<CalendarEvent[]>(
    () =>
      (events as CalendarEvent[])
        .filter((e) => !removedIds.includes(e.id))
        .sort((a, b) => {
          const ak = a.kind === "class" ? 0 : 1;
          const bk = b.kind === "class" ? 0 : 1;
          if (ak !== bk) return ak - bk;
          const at = new Date(a.start_at).getTime();
          const bt = new Date(b.start_at).getTime();
          if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
          if (Number.isNaN(at)) return 1;
          if (Number.isNaN(bt)) return -1;
          return at - bt;
        }),
    [events, removedIds]
  );

  // สร้าง map: วัน -> กิจกรรม (กระจายตามช่วง start–end)
  const eventsByDay = useMemo(
    () => buildEventsByDayForMonthRange(visibleEvents, year, month0),
    [visibleEvents, year, month0]
  );

  const changeMonth = useCallback(
    (delta: number) =>
      setAnchorDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
      ),
    []
  );

  const isSameYmdMemo = useCallback(
    (day: number) => sameYmd(todayRef.current, year, month0, day),
    [year, month0]
  );

  const monthLabel = useMemo(
    () => `${THAI_MONTHS[month0]} ${year + 543}`,
    [month0, year]
  );

  /* =============== Render =============== */
  return (
    <main className="bg-primary p-3 sm:p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-4 sm:mb-6 px-2 text-main flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h1 className="font-bold text-base sm:text-lg md:text-xl">
            ตารางชีวิตในเดือน
          </h1>

          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <IconButton
              ariaLabel="เดือนก่อนหน้า"
              onClick={() => changeMonth(-1)}
            >
              <IoMdArrowDropleftCircle className="h-6 w-6 sm:h-7 sm:w-7" />
            </IconButton>
            <div
              className="heading lg:w-[300px] sm:w-40 md:w-[180px]
                         text-sm sm:text-base md:text-lg text-center"
              aria-live="polite"
            >
              {monthLabel}
            </div>
            <IconButton ariaLabel="เดือนถัดไป" onClick={() => changeMonth(1)}>
              <IoMdArrowDroprightCircle className="h-6 w-6 sm:h-7 sm:w-7" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Calendar */}
        <section className="lg:col-span-3">
          {loading ? (
            <div
              className="bg-white rounded-4xl p-6 shadow animate-pulse h-[520px]"
              aria-busy="true"
              aria-label="กำลังโหลดปฏิทิน"
            />
          ) : error ? (
            <div
              className="bg-white rounded-4xl p-6 shadow text-red-700 text-sm sm:text-base"
              role="alert"
            >
              เกิดข้อผิดพลาดในการดึงข้อมูล
              <br />
              {error}
            </div>
          ) : (
            <CalendarCard
              calendar={calendar}
              eventsByDay={eventsByDay}
              isSameYmd={isSameYmdMemo}
              onSelectDay={setSelectedDay}
              selectedDay={selectedDay}
              onShowMore={(day, list) => {
                alert(
                  `กิจกรรมทั้งหมดของวันที่ ${day}\n\n${list
                    .map((e) => "• " + e.title)
                    .join("\n")}`
                );
              }}
            />
          )}
        </section>

        {/* Sidebar */}
        <aside
          className="bg-white rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                     p-4 sm:p-6 flex flex-col min-h-full"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-main text-center mb-3">
            กิจกรรมของฉัน
          </h2>

          <div className="flex-1 flex min-h-0">
            {loading ? (
              <div className="w-full space-y-2 self-start">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : error ? (
              <div className="w-full flex items-center justify-center">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : (
              <MonthEventList
                eventsByDay={eventsByDay}
                selectedDay={selectedDay}
                emptyText="โปรดเลือกวันที่ที่สนใจ..."
              />
            )}
          </div>

          {/* ปุ่มล่างสุด */}
          <div className="mt-auto" />
          <Link
            href="/activity"
            className="w-full text-center mt-4 py-2 rounded-full text-xl sm:text-2xl font-extrabold font-serif-thai bg-[#F1D500] text-black hover:bg-[#e0c603] transition-colors cursor-pointer"
          >
            กิจกรรม
          </Link>
        </aside>
      </div>
    </main>
  );
}
