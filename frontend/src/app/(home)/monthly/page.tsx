"use client";
import { useMemo, useState } from "react";
import { generateCalendarGrid, THAI_MONTHS } from "@/lib/datetime";
import { getActivitiesInMonth } from "@/lib/mock-activities";

export default function MonthlyPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0..11

  const calendar = useMemo(() => generateCalendarGrid(year, month), [year, month]);

  const events = useMemo(() => getActivitiesInMonth(year, month, today), [year, month, today]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, { id: string; title: string }[]> = {};
    for (const ev of events) {
      const d = new Date(ev.startAt);
      const day = d.getDate();
      (map[day] ??= []).push({ id: ev.id, title: ev.title });
    }
    return map;
  }, [events]);

  const changeMonth = (delta: number) => {
    const m = month + delta;
    if (m < 0) { setMonth(11); setYear((y) => y - 1); }
    else if (m > 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth(m);
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">⬅</button>
        <h1 className="text-2xl sm:text-3xl font-bold">ตารางประจำเดือน <span className="text-black">{THAI_MONTHS[month]}</span> {year}</h1>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">➡</button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Calendar */}
        <section className="sm:col-span-3 bg-white rounded-xl shadow border p-4">
          <div className="grid grid-cols-7 text-center font-semibold border-b pb-2">
            <div>จ</div><div>อ</div><div>พ</div><div>พฤ</div><div>ศ</div><div>ส</div><div>อา</div>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2 text-sm">
            {calendar.map((day, i) => {
              if (!day) return <div key={i} className="h-24 border rounded-lg" />;
              const dayEvents = eventsByDay[day] ?? [];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div key={i} className={`h-24 border rounded-lg p-1 flex flex-col text-gray-700 ${isToday ? "bg-blue-100 border-blue-500" : ""}`}>
                  <span className="text-xs font-bold">{day}</span>
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((ev) => (
                      <span key={ev.id} className="block bg-blue-200 text-blue-700 text-[10px] px-1 rounded truncate">
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
        </aside>
      </div>
    </main>
  );
}
