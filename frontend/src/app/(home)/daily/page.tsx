"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Event = {
  title: string;
  time: string;      // รูปแบบ "HH:MM-HH:MM"
  status?: string;
  date: string;      // YYYY-MM-DD
};

export default function DailyClient() {
  // ⏱️ เวลาแบบ real-time
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Helper วัน/เวลา
  const thaiMonths = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
  ];
  const thaiDays = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];

  // Label วัน+เวลา (real-time)
  const dateLabel = useMemo(() => {
    const d = now;
    const timeStr = d.toLocaleTimeString("th-TH", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    return `${thaiDays[d.getDay()]} ${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543} • ${timeStr}`;
  }, [now]);

  // ใช้ YYYY-MM-DD เพื่อผูก mock วันนี้ แต่กรองด้วย Date จริง
  const todayStr = useMemo(() => now.toISOString().split("T")[0], [now]);

  // ------- mock data -------
// เติม mock สำหรับ "ยังไม่ได้ลงทะเบียน" (ตารางข้างล่าง)
const moreUnregistered: Event[] = [
  { title: "เวิร์กช็อป UX สำหรับนักศึกษา", time: "14:00-15:30", date: todayStr },
  { title: "บูธสมัครชมรมวิศวกรรม",        time: "15:00-16:00", date: todayStr },
  { title: "เปิดรับสมัคร Hackathon 2025",  time: "19:00-21:00", date: todayStr },

  { title: "กิจกรรมจิตอาสาทำความสะอาดคณะ", time: "20:20-21:00", date: "2025-10-09" },
  { title: "Open House ห้องแล็บวิจัย",        time: "10:00-12:00", date: "2025-10-11" },
  { title: "อบรมพื้นฐาน Git & GitHub",       time: "13:00-15:00", date: "2025-10-12" },
  { title: "แข่งขัน E-Sports ภายในคณะ",       time: "17:00-20:00", date: "2025-10-13" },
  { title: "สัมมนา Startup กับศิษย์เก่า",     time: "16:00-18:00", date: "2025-10-14" },
  { title: "Movie Night ที่หอประชุมย่อย",     time: "18:30-21:00", date: "2025-10-15" },
  { title: "Mini Concert ชมรมดนตรี",          time: "19:00-21:00", date: "2025-10-16" },
];

// รวมเข้ากับ events เดิม
const events: Event[] = [
  // ...ของเดิมของคุณ...
  { title: "คาบเรียน CN210", time: "13:30-16:30", date: todayStr },
  { title: "กิจกรรมรับน้อง Firstmeet TU-PINE", time: "16:30-18:00", date: todayStr },
  { title: "กิจกรรมเฉลยสายรหัส", time: "18:00-20:00", date: todayStr },
  { title: "กิจกรรมรับน้องชมรม SAI", time: "20:00-22:00", date: todayStr, status: "เข้าร่วม" },
  { title: "แคมป์เกมมิ่ง", time: "20:30-22:00", date: todayStr, status: "เข้าร่วม" },
  { title: "การแข่งขันฟุตบอล", time: "16:00-18:00", date: "2025-09-28", status: "เข้าร่วม" },
  { title: "งานดนตรี", time: "16:00-18:00", date: "2025-11-29", status: "เข้าร่วม" },
  { title: "ตลาดนัดเลียบราง 1", time: "18:30-19:00", date: "2025-11-29", status: "เข้าร่วม" },

  // 👇 เติมรายการยังไม่ลงทะเบียน
  ...moreUnregistered,
];

  // ----------------------------------------------

  // Utils เปรียบเทียบวันแบบ local
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const parseYmd = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };
  const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

  // แปลง "HH:MM-HH:MM" -> วันที่เริ่ม/สิ้นสุดจริง
  const getStartDateTime = (ev: Event) => {
    try {
      const [startStr] = ev.time.split("-");
      const [hh, mm] = startStr.split(":").map(Number);
      const d = parseYmd(ev.date);
      d.setHours(hh ?? 0, mm ?? 0, 0, 0);
      return d;
    } catch {
      // ถ้า format เพี้ยน ให้ถือว่าเริ่มอนาคต (ไม่ตัดทิ้ง)
      return new Date(now.getTime() + 1e12);
    }
  };

  const isRegistered = (ev: Event) =>
    ev.status === "เข้าร่วม" || ev.title.startsWith("คาบเรียน");

  // 🟤 ตารางบน: “ของฉัน” เฉพาะวันนี้ + ให้คาบเรียนขึ้นก่อน
  const myEvents = useMemo(() => {
    return events
      .filter((ev) => sameDay(parseYmd(ev.date), now) && isRegistered(ev))
      .sort((a, b) => {
        const aClass = a.title.startsWith("คาบเรียน") ? 0 : 1;
        const bClass = b.title.startsWith("คาบเรียน") ? 0 : 1;
        return aClass - bClass;
      });
  }, [events, now]);

  // 🔵 ตารางล่าง: “ยังไม่ได้ลงทะเบียน”
  // แสดงวันนี้ + อนาคต แต่ "วันนี้" ให้แสดงเฉพาะรายการที่ startTime > now
  // (เมื่อถึงเวลาเริ่มของกิจกรรม -> ลบออกจากตารางล่าง)
  const otherEvents = useMemo(() => {
    return events.filter((ev) => {
      const notMine = !isRegistered(ev);
      if (!notMine) return false;

      const d = parseYmd(ev.date);
      const isToday = sameDay(d, now);
      const isFutureDay = d.getTime() > startOfDay(now).getTime();

      if (isFutureDay) return true;             // วันหน้า โชว์ทั้งหมด
      if (!isToday) return false;               // อดีต ไม่โชว์

      // วันนี้: ให้โชว์เฉพาะกิจกรรมที่ยัง "ไม่ถึงเวลาเริ่ม"
      const startDT = getStartDateTime(ev);
      return startDT.getTime() > now.getTime();
    });
  }, [events, now]);

  // map ให้ JSX เดิมใช้ได้ ไม่ต้องแก้ส่วนอื่น
  const todayEvents = myEvents;        // ตารางบน: ของฉัน (วันนี้)
  const upcomingEvents = otherEvents;  // ตารางล่าง: ยังไม่ลงทะเบียน (วันนี้+อนาคต แต่ลบเมื่อถึงเวลาเริ่ม)

  return (
    <main className="bg-[#f6f1e7] flex flex-col items-center p-6">
      <h1 className="w-full flex flex-col items-end text-[#730217] text-xl sm:text-2xl text-shadow-lg mb-6">
        <span className="text-2xl sm:text-3xl font-semibold mb-2">ตารางกิจกรรมประจำวัน</span>
        <span className="heading font-bold">{dateLabel}</span>
      </h1>

      <div className="bg-black w-full p-4 rounded">
        <section className="bg-white p-6">
          {/* ตารางกิจกรรมของฉัน */}
          <div className="flex justify-between font-bold text-xl sm:text-2xl mb-4 text-black p-2">
            <h2>กิจกรรมของฉัน</h2>
            <h2>ระยะเวลา</h2>
          </div>

          <table className="w-full text-sm border-collapse overflow-hidden">
            <tbody>
              {todayEvents.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={2}>
                    ยังไม่มีกิจกรรมของฉันในวันนี้
                  </td>
                </tr>
              ) : (
                todayEvents.map((ev, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-[#FFC26D]" : "bg-[#FF975E]"
                    } hover:bg-[#ffeccc] transition`}
                  >
                    <td className="p-3 border font-medium">{ev.title}</td>
                    <td className="p-3 border">{ev.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 🔹 กิจกรรมเร็วๆ นี้ */}
          <div className="w-full mt-10">
            <div className="flex justify-between font-bold text-xl sm:text-2xl mb-4 text-black p-2">
              <h2>กิจกรรมเร็ว ๆ นี้</h2>
              <h2>กำหนดการ</h2>
              <h2>ระยะเวลา</h2>
            </div>

            <table className="w-full text-sm border-collapse overflow-hidden">
              <thead>
                <tr className="bg-[#f3f3f3] text-left text-gray-700">
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={3}>
                      ยังไม่มีกิจกรรมที่ยังไม่ได้ลงทะเบียน (วันนี้/ในอนาคต)
                    </td>
                  </tr>
                ) : (
                  upcomingEvents.map((ev, idx) => {
                    const d = parseYmd(ev.date);
                    const label = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
                    return (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0 ? "bg-[#8BD8FF]" : "bg-[#8CBAFF]"
                        } hover:bg-[#cae5ff] transition`}
                      >
                       <td className="p-3 border font-medium">
  <div className="flex justify-between items-center gap-3">
    <span className="truncate">{ev.title}</span>

    
  </div>
</td>

                        <td className="p-3 border text-center">
                          <span className="text-gray-700">{label}</span>
                        </td>
                        <td className="p-3 border text-center">{ev.time}</td>
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
