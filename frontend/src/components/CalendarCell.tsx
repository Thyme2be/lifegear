// src/components/CalendarCell.tsx
"use client";

import React from "react";
import type { CalendarEvent } from "@/types/calendar";
import { rowBg } from "./daily/rowBg";

type Props = {
  day: number;
  events: CalendarEvent[];
  highlight: boolean; // วันนี้
  selected?: boolean; // วันถูกเลือก
  onShowMore?: (day: number, events: CalendarEvent[]) => void;
  onSelectDay?: (day: number) => void;
};

const MAX_EVENTS = 3;

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const EventPill = React.memo(function EventPill({ ev }: { ev: CalendarEvent }) {
  const bgColor = rowBg(ev.kind); // ✅ ใช้สีเดียวกับแถวในตาราง
  const textColor =
    ev.kind === "activity" ? "text-[#5A2E00]" : "text-[#002B7A]";

  return (
    <div
      className={cx(
        "block text-[10px] sm:text-xs px-1 rounded truncate font-semibold",
        bgColor,
        textColor
      )}
      title={ev.title}
      aria-label={ev.title}
    >
      {ev.title}
    </div>
  );
});

function CalendarCellBase({
  day,
  events,
  highlight,
  selected = false,
  onSelectDay,
  onShowMore,
}: Props) {
  const { visibleEvents, moreCount, hasMore } = React.useMemo(() => {
    const visible = events.slice(0, MAX_EVENTS);
    const more = Math.max(0, events.length - MAX_EVENTS);
    return { visibleEvents: visible, moreCount: more, hasMore: more > 0 };
  }, [events]);

  const selectThisDay = React.useCallback(() => {
    onSelectDay?.(day);
  }, [onSelectDay, day]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectThisDay();
      }
    },
    [selectThisDay]
  );

  const ariaLabel = React.useMemo(() => {
    const base = `วันที่ ${day} มีเหตุการณ์ ${events.length} รายการ`;
    if (highlight && selected) return `${base} (วันนี้, ถูกเลือก)`;
    if (highlight) return `${base} (วันนี้)`;
    if (selected) return `${base} (ถูกเลือก)`;
    return base;
  }, [day, events.length, highlight, selected]);

  return (
    <div
      role="gridcell"
      aria-selected={highlight || selected || undefined}
      aria-label={ariaLabel}
      onClick={selectThisDay}
      onKeyDown={handleKeyDown}
      tabIndex={onSelectDay ? 0 : -1}
      className={cx(
        "relative rounded-lg border p-1 sm:p-1.5 text-gray-700 bg-white",
        "aspect-square flex flex-col cursor-pointer",
        highlight && "bg-yellow-100 border-[#D1B79E]",
        selected && "ring-2 ring-[#F1D500]",
        "focus:outline-none focus:ring-2 focus:ring-[#F1D500]/60"
      )}
    >
      {/* Day number */}
      <span className="absolute top-1 right-1 text-xs sm:text-[13px] font-bold">
        {day}
      </span>

      {/* Events */}
      <div className="mt-5 sm:mt-6 space-y-1 overflow-hidden">
        {visibleEvents.map((ev) => (
          <EventPill key={ev.id} ev={ev} />
        ))}

        {hasMore && (
          <button
            type="button"
            title={`ดูทั้งหมด (+${moreCount})`}
            className="w-full text-left text-[10px] sm:text-xs px-1 rounded truncate font-semibold bg-[#74E3B3] text-[#053b2b] cursor-pointer"
            aria-label={`เหตุการณ์เพิ่มเติมอีก ${moreCount} รายการ กดเพื่อดูทั้งหมด`}
          >
            +{moreCount} รายการ
          </button>
        )}
      </div>
    </div>
  );
}

function propsAreEqual(prev: Props, next: Props) {
  if (prev.day !== next.day) return false;
  if (prev.highlight !== next.highlight) return false;
  if (prev.selected !== next.selected) return false;

  // ความยาวรายการเปลี่ยน = ต้อง render ใหม่
  if (prev.events.length !== next.events.length) return false;

  // ตรวจสอบความเปลี่ยนของ 3 รายการแรก (พอสำหรับ grid)
  for (let i = 0; i < MAX_EVENTS; i++) {
    const a = prev.events[i];
    const b = next.events[i];
    if (!a && !b) continue;
    if (!a || !b) return false;
    if (a.id !== b.id || a.title !== b.title || a.kind !== b.kind) return false;
  }
  return true;
}

export default React.memo(CalendarCellBase, propsAreEqual);
