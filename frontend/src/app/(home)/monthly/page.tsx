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
  removeRemovedId,
  clearRemovedIds,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

import IconButton from "@/components/IconButton";
import CalendarCard from "@/components/CalendarCard";
import MonthEventList from "@/components/MonthEventList";
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

function buildEventsByDayForMonth(
  events: CalendarEvent[],
  year: number,
  month0: number
) {
  const map: Record<number, CalendarEvent[]> = {};
  for (const ev of events) {
    if (!ev.start_at) continue;
    const ymd = ymdInBangkok(ev.start_at);
    if (!ymd) continue;
    const { y, m0, d } = ymd;
    if (y !== year || m0 !== month0) continue;
    (map[d] ??= []).push(ev);
  }
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
  // ใช้ ref เพื่อคง "today" ตลอดการเรนเดอร์ของเพจ
  const todayRef = useRef(new Date());

  // anchor ที่วันแรกของเดือน (คุมเดือน/ปี)
  const [anchorDate, setAnchorDate] = useState<Date>(() => {
    const t = todayRef.current;
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const { year, month: month0 } = useMemo(
    () => ({ year: anchorDate.getFullYear(), month: anchorDate.getMonth() }),
    [anchorDate]
  );

  // recycle bin state
  const [removedIds, setRemovedIds] = useState<string[]>(() =>
    readRemovedIds()
  );
  const [showBin, setShowBin] = useState(false);

  // วันที่ถูกเลือก (default: วันนี้ถ้าอยู่เดือนเดียวกัน)
  const [selectedDay, setSelectedDay] = useState<number | null>(() =>
    getInitialSelectedDay(todayRef.current, year, month0)
  );
  useEffect(() => {
    setSelectedDay(getInitialSelectedDay(todayRef.current, year, month0));
  }, [year, month0]);

  // sync removedIds เมื่อ localStorage จาก tab อื่นเปลี่ยน
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMOVED_IDS_KEY) setRemovedIds(readRemovedIds());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // calendar grid
  const calendar = useMemo(
    () => generateCalendarGrid(year, month0, { weekStartsOn: 1 }),
    [year, month0]
  );

  // fetch events ของเดือนนั้น
  const ym = `${year}-${String(month0 + 1).padStart(2, "0")}`;
  const url = `${apiRoutes.getMyMonthlyEvents}?ym=${ym}`;
  const { loading, error, events } = useMonthlyEvents(year, month0, url);

  // กรองรายการที่ถูกซ่อนไว้ในถัง
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

  const removedEventsThisMonth = useMemo<CalendarEvent[]>(() => {
    return (events as CalendarEvent[]).filter((e) => {
      if (!removedIds.includes(e.id)) return false;
      const ymd = ymdInBangkok(e.start_at);
      if (!ymd) return false;
      return ymd.y === year && ymd.m0 === month0;
    });
  }, [events, removedIds, year, month0]);

  const eventsByDay = useMemo(
    () => buildEventsByDayForMonth(visibleEvents, year, month0),
    [visibleEvents, year, month0]
  );

  const changeMonth = useCallback(
    (delta: number) =>
      setAnchorDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
      ),
    []
  );

  const restoreAll = useCallback(() => {
    clearRemovedIds();
    setRemovedIds([]);
  }, []);

  const restoreOne = useCallback((id: string) => {
    removeRemovedId(id);
    setRemovedIds((prev) => prev.filter((x) => x !== id));
  }, []);

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
    <main className="bg-[#f6f1e7] p-3 sm:p-6">
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

      {/* Layout: ทำให้คอลัมน์สูงเท่ากันโดย default ของ CSS Grid (stretch) + ใส่ items-stretch ชัดเจน */}

      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Calendar (คงขนาดเดิมทุกอย่าง) */}
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

        {/* Sidebar: ยืดสูงเท่ากับ track เดียวกันของ grid */}
        <aside
          className="bg-white rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                     p-4 sm:p-6 flex flex-col min-h-full"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-main text-center mb-3">
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
            className="w-full text-center mt-4 py-2 rounded-full text-base sm:text-lg font-extrabold font-serif-thai bg-[#F1D500] text-black hover:bg-[#e0c603] transition-colors cursor-pointer"
          >
            กิจกรรม
          </Link>
        </aside>
      </div>
    </main>
  );
}
