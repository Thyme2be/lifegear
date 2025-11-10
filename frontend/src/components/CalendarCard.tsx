"use client";

import React from "react";
import CalendarCell from "./CalendarCell";
import type { CalendarEvent } from "@/types/calendar";

const WEEKDAY_LABELS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"] as const;

type Props = {
  calendar: (number | null)[];
  eventsByDay: Record<number, CalendarEvent[]>;
  isSameYmd: (d: number) => boolean;
  onShowMore?: (day: number, events: CalendarEvent[]) => void;
  onSelectDay?: (day: number) => void;
  selectedDay?: number | null;
};

export default function CalendarCard({
  calendar,
  eventsByDay,
  isSameYmd,
  onShowMore,
  onSelectDay,
  selectedDay,
}: Props) {
  return (
    <section
      aria-label="ปฏิทินรายเดือน"
      className="rounded-xl border-4 border-[#D1B79E] bg-[#FFF8E7] shadow-md p-2 sm:p-3"
    >
      <div
        className="grid grid-cols-7 text-center font-semibold pb-2 border-b text-main text-[12px] sm:text-sm md:text-base"
        role="row"
        aria-hidden="true"
      >
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="min-w-0">{d}</div>
        ))}
      </div>

      <div
        className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-2.5 overflow-visible"
        role="grid"
        aria-readonly
      >
        {calendar.map((day, i) => {
          if (day === null) {
            return (
              <div
                key={`empty-${i}`}
                className="rounded-md border bg-[#F2E8D5] aspect-square"
                aria-hidden="true"
              />
            );
          }

          const dayEvents = eventsByDay[day] ?? [];
          const highlight = isSameYmd(day);
          const isSelected = selectedDay === day;

          return (
            <CalendarCell
              key={`d-${day}-i-${i}`}
              day={day}
              events={dayEvents}
              highlight={highlight}
              selected={isSelected}
              onSelectDay={onSelectDay}
              onShowMore={onShowMore}
            />
          );
        })}
      </div>
    </section>
  );
}
