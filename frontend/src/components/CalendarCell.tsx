// src/components/monthly/CalendarCell.tsx
import Link from "next/link";
import React from "react";
import type { DayEvent } from "@/types/monthly";

type Props = {
  day: number;
  events: DayEvent[];
  highlight: boolean;
  onShowMore?: (day: number, events: DayEvent[]) => void;
};

function CalendarCellBase({ day, events, highlight, onShowMore }: Props) {
  const MAX_EVENTS = 3;
  const visibleEvents = events.slice(0, MAX_EVENTS);
  const hasMore = events.length > MAX_EVENTS;

  return (
    <div
      role="gridcell"
      aria-selected={highlight || undefined}
      className={[
        "relative rounded-lg border p-1 sm:p-1.5 text-gray-700 bg-white",
        "aspect-square flex flex-col",
        highlight ? "bg-yellow-100 border-[#D1B79E]" : "",
      ].join(" ")}
    >
      <span className="absolute top-1 right-1 text-xs sm:text-[13px] font-bold">
        {day}
      </span>

      <div className="mt-5 sm:mt-6 space-y-1 overflow-hidden">
        {visibleEvents.map((ev) => (
          <Link
            key={ev.id}
            href={`/activity/${ev.id}`}
            className="block bg-[#FFCA64] text-[#5A2E00] text-[10px] sm:text-xs px-1 rounded truncate font-semibold"
            title={ev.title}
          >
            {ev.title}
          </Link>
        ))}

        {hasMore && (
          <button
            type="button"
            onClick={() =>
              onShowMore
                ? onShowMore(day, events)
                : alert(
                    `กิจกรรมทั้งหมดของวันที่ ${day}\n\n${events
                      .map((e) => "• " + e.title)
                      .join("\n")}`
                  )
            }
            className="w-full flex justify-left text-[10px] bg-[#74E3B3] sm:text-xs text-[#5A2E00] underline cursor-pointer px-1 rounded truncate font-semibold"
          >
            ...ดูทั้งหมด
          </button>
        )}
      </div>
    </div>
  );
}

/** ป้องกัน re-render เกินจำเป็นเมื่อ props ไม่เปลี่ยน */
const CalendarCell = React.memo(CalendarCellBase);
export default CalendarCell;
