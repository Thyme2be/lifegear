import React from "react";

type Event = {
  title: string;
  time: string;
  status?: string;
  date: string; // YYYY-MM-DD
};

export default function DailyClient() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const thaiDays = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];

  // format วันที่ภาษาไทย
  const dateLabel = `${thaiDays[today.getDay()]} ${today.getDate()} ${
    thaiMonths[today.getMonth()]
  } ${today.getFullYear() + 543}`;

  // mock ข้อมูลกิจกรรม
  const events: Event[] = [
    { title: "คาบเรียน SF212", time: "09:30-12:30", date: todayStr },
    { title: "คาบเรียน CN210", time: "13:30-16:30", date: todayStr },
    {
      title: "กิจกรรมรับน้อง Firstmeet TU-PINE",
      time: "16:30-18:00",
      date: todayStr,
    },
    { title: "กิจกรรมเฉลยสายรหัส", time: "18:00-20:00", date: todayStr },
    {
      title: "กิจกรรมรับน้องชมรม SAI",
      time: "20:00-22:00",
      date: todayStr,
      status: "หมดเขต",
    },
    {
      title: "แคมป์เกมมิ่ง",
      time: "20:30-22:00",
      date: todayStr,
      status: "เข้าร่วม",
    },

    {
      title: "การแข่งขันฟุตบอล",
      time: "16:00-18:00",
      date: "2025-08-28",
      status: "เข้าร่วม",
    },
    {
      title: "งานดนตรี",
      time: "16:00-18:00",
      date: "2025-08-29",
      status: "เข้าร่วม",
    },
    {
      title: "ตลาดนัดเลียบราง 1",
      time: "18:30-19:00",
      date: "2025-08-29",
      status: "เข้าร่วม",
    },
  ];

  const todayEvents = events.filter((ev) => ev.date === todayStr);
  const upcomingEvents = events.filter((ev) => ev.date > todayStr);

  return (
    <main className="min-h-screen w-full bg-gray-50 p-6 flex flex-col items-center">
      {/* หัวข้อ */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        ตารางกิจกรรมประจำวัน <br />
        <span className="text-blue-600">{dateLabel}</span>
      </h1>

      <div className="w-full max-w-5xl space-y-10">
        {/* กิจกรรมวันนี้ */}
        <section className="bg-white rounded-xl shadow-md border p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">
            กิจกรรมวันนี้
          </h2>
          <table className="w-full text-sm border-collapse rounded overflow-hidden shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-2 border">กิจกรรม</th>
                <th className="p-2 border">ระยะเวลา</th>
                <th className="p-2 border">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {todayEvents.map((ev, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{ev.title}</td>
                  <td className="p-2 border">{ev.time}</td>
                  <td className="p-2 border">
                    {ev.status ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          ev.status === "หมดเขต"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {ev.status}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600 font-semibold">
                        วันนี้
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* กิจกรรมเร็วๆนี้ */}
        <section className="bg-white rounded-xl shadow-md border p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">
            กิจกรรมเร็วๆนี้
          </h2>
          <table className="w-full text-sm border-collapse rounded overflow-hidden shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-2 border">กิจกรรม</th>
                <th className="p-2 border">ระยะเวลา</th>
                <th className="p-2 border">กำหนดการ</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((ev, idx) => {
                const d = new Date(ev.date);
                const label = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${
                  d.getFullYear() + 543
                }`;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{ev.title}</td>
                    <td className="p-2 border">{ev.time}</td>
                    <td className="p-2 border">
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-600 font-semibold">
                        {ev.status || "เร็วๆนี้"}
                      </span>{" "}
                      <span className="text-gray-600">{label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
