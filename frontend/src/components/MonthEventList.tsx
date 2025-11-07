"use client";

import Link from "next/link";
import React from "react";
import type { CalendarEvent } from "@/types/calendar";
import { ymdInBangkok } from "@/lib/datetime";

type Props = {
  eventsByDay: Record<number, CalendarEvent[]>;
  selectedDay: number | null | undefined;
  emptyText?: string;
};

export default function MonthEventList({
  eventsByDay,
  selectedDay,
  emptyText = "โปรดเลือกวันที่ที่สนใจ...",
}: Props) {
  if (!selectedDay) {
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-xl">{emptyText}</p>
      </div>
    );
  }

  const list = eventsByDay[selectedDay] ?? [];
  if (list.length === 0) {
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-xl">
          ไม่มีข้อมูลกิจกรรมในวันที่ {selectedDay}
        </p>
      </div>
    );
  }

  return (
    <ul className="text-sm space-y-2 flex-1 overflow-auto pr-1">
      <li>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-main text-lg">
            วันที่ {selectedDay}
          </span>
          <div className="flex-1" />
        </div>

        {/* ลิสต์รายการ: ขึ้นบรรทัดใหม่เสมอ + สีตามประเภท + ลิงก์ไปหน้า Daily */}
        <ul className="ml-4 mt-1 space-y-1">
          {list.map((x) => {
            // แยกสีตามประเภท
            const isClass = x.kind === "class";
            const bg = isClass ? "bg-[#A3BBEE]" : "bg-[#FFCA64]";
            const fg = "text-black";

            // สร้างลิงก์ไปหน้า daily ด้วยวันที่จาก start_at (โซนเวลา BKK)
            let dailyHref = "/daily";
            if (x.start_at) {
              const ymd = ymdInBangkok(x.start_at);
              if (ymd) {
                const mm = String(ymd.m0 + 1).padStart(2, "0");
                const dd = String(ymd.d).padStart(2, "0");
                dailyHref = `/daily?date=${ymd.y}-${mm}-${dd}`;
              }
            }

            return (
              <li key={x.id} className="list-none">
                <Link
                  prefetch={false}
                  href={dailyHref}
                  className={`block w-full ${bg} ${fg} text-sm sm:text-lg px-2 py-1 rounded-md hover:underline focus:outline-none focus:ring-2 focus:ring-main/40`}
                  title={x.title}
                >
                  • {x.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    </ul>
  );
}
