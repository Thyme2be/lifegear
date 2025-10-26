"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";

import { generateCalendarGrid, THAI_MONTHS } from "@/lib/datetime";
import { getActivitiesInMonth } from "@/lib/mock-activities";
import {
  readRemovedIds,
  removeRemovedId,
  clearRemovedIds,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

import IconButton from "@/components/IconButton";
import CalendarCard from "@/components/CalendarCard";
import MonthEventList from "@/components/MonthEventList";
import type { DayEvent } from "@/types/monthly";

/* =============== Helpers =============== */
function sameYmd(a: Date, y: number, m: number, d: number) {
  return a.getFullYear() === y && a.getMonth() === m && a.getDate() === d;
}

function buildEventsByDay(
  events: { id: string; title: string; startAt: string }[]
) {
  const map: Record<number, DayEvent[]> = {};
  for (const ev of events) {
    const d = new Date(ev.startAt);
    const day = d.getDate();
    (map[day] ??= []).push({ id: ev.id, title: ev.title });
  }
  return map;
}

/* =============== Page =============== */
export default function MonthlyPage() {
  // today ที่ไม่เปลี่ยนทุก render
  const todayRef = useRef(new Date());

  // ใช้ Date เดียวเป็น anchor ของเดือนที่กำลังดู (ชี้ที่วันที่ 1 เสมอเพื่อเลี่ยง edge case)
  const [anchorDate, setAnchorDate] = useState<Date>(() => {
    const t = todayRef.current;
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  // ดึงค่าปี/เดือนจาก anchorDate — ใช้ useMemo เพราะอ่านบ่อย
  const { year, month } = useMemo(
    () => ({
      year: anchorDate.getFullYear(),
      month: anchorDate.getMonth(),
    }),
    [anchorDate]
  );

  // ถังลบ
  const [removedIds, setRemovedIds] = useState<string[]>(() =>
    readRemovedIds()
  );
  const [showBin, setShowBin] = useState(false);

  // sync removedIds เมื่อแท็บอื่นเปลี่ยนค่า
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMOVED_IDS_KEY) setRemovedIds(readRemovedIds());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ตารางเดือน (เริ่มวันจันทร์)
  const calendar = useMemo(
    () => generateCalendarGrid(year, month, { weekStartsOn: 1 }),
    [year, month]
  );

  // ดึงกิจกรรมของเดือนนี้ (อ้าง today เฉย ๆ เพื่อ mock “ปัจจุบัน”)
  const allEvents = useMemo(
    () => getActivitiesInMonth(year, month, todayRef.current),
    [year, month]
  );

  // คัดออกกิจกรรมที่ถูกลบ
  const events = useMemo(
    () => allEvents.filter((e) => !removedIds.includes(e.id)),
    [allEvents, removedIds]
  );

  // สำหรับถังรีไซเคิล
  const removedEventsThisMonth = useMemo(
    () => allEvents.filter((e) => removedIds.includes(e.id)),
    [allEvents, removedIds]
  );

  // กลุ่มกิจกรรมตามวันที่ (คำนวณครั้งเดียวจาก events)
  const eventsByDay = useMemo(() => buildEventsByDay(events), [events]);

  // เปลี่ยนเดือนแบบ atomic ด้วย anchorDate เดียว
  const changeMonth = useCallback((delta: number) => {
    setAnchorDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
  }, []);

  // กู้คืน
  const restoreAll = useCallback(() => {
    clearRemovedIds();
    setRemovedIds([]);
  }, []);

  const restoreOne = useCallback((id: string) => {
    removeRemovedId(id);
    setRemovedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  // เช็ค “วันนี้” ด้วย todayRef (นิ่ง) + year/month/day ปัจจุบันของ grid
  const isSameYmd = useCallback(
    (day: number) => sameYmd(todayRef.current, year, month, day),
    [year, month]
  );

  // handler ดูทั้งหมด
  const handleShowMore = useCallback((day: number, list: DayEvent[]) => {
    alert(
      `กิจกรรมทั้งหมดของวันที่ ${day}\n\n${list
        .map((e) => "• " + e.title)
        .join("\n")}`
    );
  }, []);

  // ป้ายเดือน/ปี พ.ศ.
  const monthLabel = useMemo(
    () => `${THAI_MONTHS[month]} ${year + 543}`,
    [month, year]
  );

  return (
    <main className="min-h-screen w-full bg-[#f6f1e7] p-4 sm:p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-4 sm:mb-6 flex items-center justify-center gap-3 text-main">
        <h1 className="normal-text">ตารางชีวิตในเดือน</h1>
        <span className="inline-flex items-center gap-2 align-middle">
          <IconButton ariaLabel="เดือนก่อนหน้า" onClick={() => changeMonth(-1)}>
            <IoMdArrowDropleftCircle size={24} />
          </IconButton>
          <span className="heading">{monthLabel}</span>
          <IconButton ariaLabel="เดือนถัดไป" onClick={() => changeMonth(1)}>
            <IoMdArrowDroprightCircle size={24} />
          </IconButton>
        </span>
      </header>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <CalendarCard
            calendar={calendar}
            eventsByDay={eventsByDay}
            isSameYmd={isSameYmd}
            onShowMore={handleShowMore}
          />
        </div>

        {/* Sidebar */}
        <aside className="bg-white rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 sm:p-6 flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold text-main text-center mb-3">
            กิจกรรมในเดือน “{THAI_MONTHS[month]}”
          </h2>

          <MonthEventList eventsByDay={eventsByDay} />

          <Link
            href="/activity"
            className="text-center mt-4 w-full py-2 rounded-full text-lg sm:text-xl font-extrabold font-serif-thai bg-[#F1D500] text-black hover:bg-[#e0c603] transition-colors cursor-pointer"
          >
            กิจกรรมทั้งหมด
          </Link>

          <div className="mt-4 border-t pt-3">
            <button
              type="button"
              onClick={() => setShowBin((s) => !s)}
              className="w-full text-xs px-3 py-2 rounded border hover:bg-gray-50"
            >
              {showBin
                ? "ซ่อนรายการที่ถูกลบ"
                : `แสดงรายการที่ถูกลบ (${removedEventsThisMonth.length})`}
            </button>

            {showBin && (
              <div className="mt-2 space-y-2">
                {removedEventsThisMonth.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    ไม่มีรายการที่ถูกลบในเดือนนี้
                  </p>
                ) : (
                  <>
                    <ul className="space-y-1">
                      {removedEventsThisMonth.map((ev) => (
                        <li
                          key={ev.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="truncate mr-2">{ev.title}</span>
                          <button
                            type="button"
                            onClick={() => restoreOne(ev.id)}
                            className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            กู้คืน
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={restoreAll}
                      className="mt-2 w-full text-xs px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      กู้คืนทั้งหมด
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
