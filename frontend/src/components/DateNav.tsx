"use client";

import React, { useId } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoToday,
  IoCalendarOutline,
} from "react-icons/io5";

function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function parseYmdSafe(ymd: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d)
    return null;
  return dt;
}

function addDays(ymd: string, days: number) {
  const base = parseYmdSafe(ymd) ?? new Date();
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return toDateInputValue(next);
}

export default function DateNav({
  value,
  onChange,
  className,
  placeholder = "เลือกวันที่สนใจ",
}: {
  value: string; // "YYYY-MM-DD"
  onChange: (nextYmd: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const todayYmd = toDateInputValue(new Date());
  const inputId = useId(); // กันชนกันหลายอินสแตนซ์

  return (
    <div
      className={`flex flex-col sm:flex-row gap-2 sm:items-center justify-center ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(addDays(value, -1))}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-50 bg-white cursor-pointer"
          aria-label="วันก่อนหน้า"
          title="วันก่อนหน้า"
        >
          <IoChevronBack />
          <span className="hidden sm:inline">ก่อนหน้า</span>
        </button>

        {/* ปุ่ม UI ที่แสดงข้อความตลอด + อินพุตจริงโปร่งใสซ้อนทับ */}
        <div className="relative inline-block">
          <label
            htmlFor={inputId}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-white cursor-pointer hover:bg-gray-50 select-none cursor-pointer"
          >
            <span>{placeholder}</span>
            <IoCalendarOutline aria-hidden="true"/>
          </label>

          <input
            id={inputId}
            type="date"
            className="absolute inset-0 w-full h-full opacity-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="เลือกวันจากปฏิทิน"
          />

          {/* แจ้งสถานะให้ screen reader (ไม่แสดงบนจอ) */}
          <span className="sr-only" aria-live="polite">
            {value ? `เลือกแล้ว ${value}` : "ยังไม่ได้เลือกวันที่"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onChange(todayYmd)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-50 bg-white cursor-pointer"
          aria-label="ไปวันนี้"
          title="ไปวันนี้"
        >
          <span className="hidden sm:inline">วันนี้</span>
          <IoToday />
        </button>

        <button
          type="button"
          onClick={() => onChange(addDays(value, 1))}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-50 bg-white cursor-pointer"
          aria-label="วันถัดไป"
          title="วันถัดไป"
        >
          <span className="hidden sm:inline">ถัดไป</span>
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
}
