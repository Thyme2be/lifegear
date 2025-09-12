"use client";
import { useState } from "react";

// mock ข้อมูลกิจกรรม
const eventList: { date: string; title: string }[] = [
  { date: "2025-08-05", title: "แข่งกีฬา" },
  { date: "2025-08-10", title: "งานดนตรี" },
  { date: "2025-08-20", title: "ตลาดนัด" },
  { date: "2025-09-01", title: "เปิดเทอม" },
];

// ฟังก์ชันสร้างปฏิทิน
function generateCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar: (number | null)[] = [];
  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) calendar.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendar.push(day);
  return calendar;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const monthNames = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
  ];

  const calendar = generateCalendar(year, month);

  const changeMonth = (direction: number) => {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    else if (newMonth > 11) { newMonth = 0; newYear++; }
    setMonth(newMonth);
    setYear(newYear);
  };

  const currentMonthEvents = eventList.filter((event) => {
    const d = new Date(event.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <main className="min-h-screen w-full bg-gray-50 p-6 flex flex-col items-center">
      {/* หัวข้อ + ปุ่มเลื่อนเดือน */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">⬅</button>
        <h1 className="text-2xl sm:text-3xl font-bold">
          ตารางประจำเดือน <span className="text-black">{monthNames[month]}</span> {year}
        </h1>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">➡</button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* ปฏิทิน */}
        <section className="sm:col-span-3 bg-white rounded-xl shadow border p-4">
          <div className="grid grid-cols-7 text-center font-semibold border-b pb-2">
            <div>จ</div><div>อ</div><div>พ</div><div>พฤ</div><div>ศ</div><div>ส</div><div>อา</div>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2 text-sm">
            {calendar.map((day, i) => {
              if (!day) return <div key={i} className="h-24 border rounded-lg"></div>;
              const dayEvents = currentMonthEvents.filter((ev) => new Date(ev.date).getDate() === day);
              return (
                <div key={i} className={`h-24 border rounded-lg p-1 flex flex-col text-gray-700 ${
                  day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                    ? "bg-blue-100 border-blue-500" : ""
                }`}>
                  <span className="text-xs font-bold">{day}</span>
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((ev, idx) => (
                      <span key={idx} className="block bg-blue-200 text-blue-700 text-[10px] px-1 rounded truncate">
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
            กิจกรรมในเดือน <span className="text-black">“{monthNames[month]}”</span>
          </h2>
          <ul className="text-sm space-y-2 flex-1">
            {currentMonthEvents.length > 0 ? currentMonthEvents.map((ev, idx) => (
              <li key={idx}>{new Date(ev.date).getDate()}: {ev.title}</li>
            )) : <li className="text-gray-400">ไม่มีข้อมูลกิจกรรม</li>}
          </ul>
          <button className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
            เพิ่มกิจกรรม
          </button>
        </aside>
      </div>
    </main>
  );
}