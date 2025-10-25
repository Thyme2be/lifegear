"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateCalendarGrid, THAI_MONTHS } from "@/lib/datetime";
import { getActivitiesInMonth } from "@/lib/mock-activities";
import {
  readRemovedIds,
  removeRemovedId,
  clearRemovedIds,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

export default function MonthlyPage() {
  // ทำ today ให้ "คงที่" ตลอดอายุคอมโพเนนต์
  const todayRef = useRef<Date>(new Date());

  // ใช้ lazy initializer เพื่อลดงาน compute ตอน mount
  const [year, setYear] = useState(() => todayRef.current.getFullYear());
  const [month, setMonth] = useState(() => todayRef.current.getMonth()); // 0..11

  const [removedIds, setRemovedIds] = useState<string[]>(() => readRemovedIds());
  const [showBin, setShowBin] = useState(false);

  // sync เมื่อแท็บอื่นเปลี่ยนค่า
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMOVED_IDS_KEY) {
        setRemovedIds(readRemovedIds());
      }
    };
    // เผื่อไว้สำหรับ SSR — ถึงจะเป็น client component ก็ใส่ guard ให้ชัด
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, []);

  // ตารางวันของเดือน (ไม่ขึ้นกับ today)
  const calendar = useMemo(
    () => generateCalendarGrid(year, month, { weekStartsOn: 1 }),
    [year, month]
  );

  // ดึงกิจกรรมของเดือนนี้ (ใช้อิง today ที่คงที่ผ่าน .current)
  const allEvents = useMemo(
    () => getActivitiesInMonth(year, month, todayRef.current),
    [year, month]
  );

  // รายการกิจกรรมที่ถูกซ่อนของ "เดือนนี้" (เพื่อแสดงในถังรีไซเคิล)
  const removedEventsThisMonth = useMemo(() => {
    return allEvents.filter((e) => removedIds.includes(e.id));
  }, [allEvents, removedIds]);

  // กรองกิจกรรมที่ถูก “ลบออกจากรายเดือน”
  const events = useMemo(
    () => allEvents.filter((e) => !removedIds.includes(e.id)),
    [allEvents, removedIds]
  );

  // จัดกลุ่มกิจกรรมตามวันในเดือน
  const eventsByDay = useMemo(() => {
    const map: Record<number, { id: string; title: string }[]> = {};
    for (const ev of events) {
      const d = new Date(ev.startAt);
      const day = d.getDate();
      (map[day] ??= []).push({ id: ev.id, title: ev.title });
    }
    return map;
  }, [events]);

  // เปลี่ยนเดือน (ใช้ useCallback เพื่อความเสถียรของอ้างอิง)
  const changeMonth = useCallback((delta: number) => {
    setMonth((m) => {
      const next = m + delta;
      if (next < 0) {
        setYear((y) => y - 1);
        return 11;
      }
      if (next > 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return next;
    });
  }, []);

  // กู้คืนทั้งหมด
  const restoreAll = useCallback(() => {
    clearRemovedIds();
    setRemovedIds([]);
  }, []);

  // กู้คืนรายตัว
  const restoreOne = useCallback((id: string) => {
    removeRemovedId(id);
    setRemovedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  // ค่าช่วยเช็ควันนี้ (ใช้ todayRef.current เสมอ)
  const isSameYmd = useCallback(
    (d: number) =>
      d === todayRef.current.getDate() &&
      month === todayRef.current.getMonth() &&
      year === todayRef.current.getFullYear(),
    [month, year]
  );

  return (
    <main className="min-h-screen w-full bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          ⬅
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">
          ตารางประจำเดือน <span className="text-black">{THAI_MONTHS[month]}</span> {year}
        </h1>
        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          ➡
        </button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Calendar */}
        <section className="sm:col-span-3 bg-white rounded-xl shadow border p-4">
          <div className="grid grid-cols-7 text-center font-semibold border-b pb-2">
            <div>จ</div>
            <div>อ</div>
            <div>พ</div>
            <div>พฤ</div>
            <div>ศ</div>
            <div>ส</div>
            <div>อา</div>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2 text-sm">
            {calendar.map((day, i) => {
              if (!day) return <div key={i} className="h-24 border rounded-lg" />;
              const dayEvents = eventsByDay[day] ?? [];
              const highlight = isSameYmd(day);

              return (
                <div
                  key={i}
                  className={`h-24 border rounded-lg p-1 flex flex-col text-gray-700 ${
                    highlight ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  <span className="text-xs font-bold">{day}</span>
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((ev) => (
                      <span
                        key={ev.id}
                        className="block bg-blue-200 text-blue-700 text-[10px] px-1 rounded truncate"
                      >
                        {ev.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sm:col-span-1 bg-white rounded-xl shadow border p-4 flex flex-col">
          <h2 className="font-bold mb-4 text-center">
            กิจกรรมในเดือน <span className="text-black">“{THAI_MONTHS[month]}”</span>
          </h2>
          <ul className="text-sm space-y-2 flex-1">
            {Object.keys(eventsByDay).length > 0 ? (
              Object.entries(eventsByDay)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([day, list]) => (
                  <li key={day}>
                    {day}: {list.map((x) => x.title).join(", ")}
                  </li>
                ))
            ) : (
              <li className="text-gray-400">ไม่มีข้อมูลกิจกรรม</li>
            )}
          </ul>

          <button className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
            เพิ่มกิจกรรม
          </button>

          <div className="mt-4 border-t pt-3">
            <button
              onClick={() => setShowBin((s) => !s)}
              className="w-full text-xs px-3 py-2 rounded border hover:bg-gray-50"
            >
              {showBin
                ? "ซ่อนรายการที่ถูกซ่อน"
                : `แสดงรายการที่ถูกซ่อน (${removedEventsThisMonth.length})`}
            </button>

            {showBin && (
              <div className="mt-2 space-y-2">
                {removedEventsThisMonth.length === 0 ? (
                  <p className="text-xs text-gray-500">ไม่มีรายการที่ถูกซ่อนในเดือนนี้</p>
                ) : (
                  <>
                    <ul className="space-y-1">
                      {removedEventsThisMonth.map((ev) => (
                        <li key={ev.id} className="flex items-center justify-between text-xs">
                          <span className="truncate mr-2">{ev.title}</span>
                          <button
                            onClick={() => restoreOne(ev.id)}
                            className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            กู้คืน
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
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
