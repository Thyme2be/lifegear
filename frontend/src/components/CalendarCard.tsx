// src/components/monthly/CalendarCard.tsx
import React from "react";
import CalendarCell from "./CalendarCell";
import type { DayEvent } from "@/types/monthly";

const WEEKDAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"] as const;

type Props = {
  calendar: (number | null)[];
  eventsByDay: Record<number, DayEvent[]>;
  isSameYmd: (d: number) => boolean;
  onShowMore?: (day: number, events: DayEvent[]) => void;
};

export default function CalendarCard({
  calendar,
  eventsByDay,
  isSameYmd,
  onShowMore,
}: Props) {
  return (
    <section
      aria-label="ปฏิทินรายเดือน"
      className="rounded-xl border-4 border-[#D1B79E] bg-[#FFF8E7] shadow-md p-2 sm:p-3"
    >
      <div
        className="grid grid-cols-7 text-center font-semibold pb-2 border-b text-[#730217] text-sm sm:text-base"
        role="row"
        aria-hidden="true"
      >
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div
        className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2 overflow-y-visible"
        role="grid"
        aria-readonly
      >
        {calendar.map((day, i) => {
          if (!day) {
            return (
              <div
                key={i}
                className="rounded-md border bg-[#F2E8D5] aspect-square"
                aria-hidden="true"
              />
            );
          }
          const dayEvents = eventsByDay[day] ?? [];
          const highlight = isSameYmd(day);

          return (
            <CalendarCell
              key={i}
              day={day}
              events={dayEvents}
              highlight={highlight}
              onShowMore={onShowMore}
            />
          );
        })}
      </div>
    </section>
  );
}
