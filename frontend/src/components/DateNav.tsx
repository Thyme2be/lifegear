"use client";

import React from "react";
import { IoChevronBack, IoChevronForward, IoToday } from "react-icons/io5";

function toDateInputValue(d: Date) {
  // YYYY-MM-DD (ตามสเปก input[type=date])
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function parseYmdSafe(ymd: string) {
  // คาดหวังรูปแบบ YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  // กัน invalid เช่น 2025-02-31
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
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
}: {
  value: string;                // "YYYY-MM-DD"
  onChange: (nextYmd: string) => void;
  className?: string;
}) {
  const todayYmd = toDateInputValue(new Date());

  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:items-center ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(addDays(value, -1))}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-50"
          aria-label="วันก่อนหน้า"
          title="วันก่อนหน้า"
        >
          <IoChevronBack />
          <span className="hidden sm:inline">ก่อนหน้า</span>
        </button>

        <input
          type="date"
          className="rounded-lg border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="เลือกวัน"
        />

        <button
          type="button"
          onClick={() => onChange(todayYmd)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-50"
          aria-label="ไปวันนี้"
          title="ไปวันนี้"
        >
          <IoToday />
          <span className="hidden sm:inline">วันนี้</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(addDays(value, 1))}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-50"
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
