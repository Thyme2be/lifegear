"use client";

import React from "react";
import type { CalendarEvent } from "@/types/calendar";

type Props = {
  day: number;
  events: CalendarEvent[];
  highlight: boolean;
  selected?: boolean;
  onShowMore?: (day: number, events: CalendarEvent[]) => void;
  onSelectDay?: (day: number) => void;
};

function CalendarCellBase({
  day,
  events,
  highlight,
  selected = false,
  onShowMore,
  onSelectDay,
}: Props) {
  const MAX_EVENTS = 3;
  const visibleEvents = events.slice(0, MAX_EVENTS);
  const moreCount = Math.max(0, events.length - MAX_EVENTS);
  const hasMore = moreCount > 0;

  const selectThisDay = React.useCallback(() => {
    onSelectDay?.(day);
  }, [onSelectDay, day]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectThisDay();
    }
  };

  return (
    <div
      role="gridcell"
      aria-selected={highlight || selected || undefined}
      onPointerDownCapture={selectThisDay}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className={[
        "relative rounded-lg border p-1 sm:p-1.5 text-gray-700 bg-white",
        "aspect-square flex flex-col cursor-pointer",
        highlight ? "bg-yellow-100 border-[#D1B79E]" : "",
        selected ? "ring-2 ring-[#F1D500]" : "",
        "focus:outline-none focus:ring-2 focus:ring-[#F1D500]/60",
      ].join(" ")}
    >
      <span className="absolute top-1 right-1 text-xs sm:text-[13px] font-bold">
        {day}
      </span>

      <div className="mt-5 sm:mt-6 space-y-1 overflow-hidden">
        {visibleEvents.map((ev) => {
          const isClass = ev.kind === "class";
          const bgColor = isClass ? "bg-[#A3BBEE]" : "bg-[#FFCA64]";
          const textColor = isClass ? "text-[#002B7A]" : "text-[#5A2E00]";

          return (
            <div
              key={ev.id}
              className={`block ${bgColor} ${textColor} text-[10px] sm:text-xs px-1 rounded truncate font-semibold`}
              title={ev.title} // tooltip native
            >
              {ev.title}
            </div>
          );
        })}

        {hasMore && (
          <div
            title={`ดูทั้งหมด (+${moreCount})`}
            className="w-full text-left text-[10px] sm:text-xs px-1 rounded truncate font-semibold bg-[#74E3B3] text-[#053b2b] focus:outline-none focus:ring-2 focus:ring-[#F1D500]/60"
          >
            ....
          </div>
        )}
      </div>
    </div>
  );
}

function propsAreEqual(prev: Props, next: Props) {
  if (prev.day !== next.day) return false;
  if (prev.highlight !== next.highlight) return false;
  if (prev.selected !== next.selected) return false;
  if (prev.events.length !== next.events.length) return false;

  // ตรวจ 3 รายการแรกเพื่อเร่ง perf
  for (let i = 0; i < 3; i++) {
    const a = prev.events[i];
    const b = next.events[i];
    if (!a && !b) continue;
    if (!a || !b) return false;
    if (a.id !== b.id || a.title !== b.title || a.kind !== b.kind) return false;
  }
  return true;
}

export default React.memo(CalendarCellBase, propsAreEqual);
