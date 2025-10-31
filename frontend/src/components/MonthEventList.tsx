// src/components/monthly/MonthEventList.tsx
import Link from "next/link";
import React from "react";
import type { DayEvent } from "@/types/monthly";

type Props = {
  eventsByDay: Record<number, DayEvent[]>;
  emptyText?: string;
};

export default function MonthEventList({
  eventsByDay,
  emptyText = "ไม่มีข้อมูลกิจกรรม",
}: Props) {
  const hasEvents = Object.keys(eventsByDay).length > 0;
  if (!hasEvents) {
    return <p className="text-gray-400 text-sm">{emptyText}</p>;
  }

  return (
    <ul className="text-sm space-y-2 flex-1 overflow-auto pr-1">
      {Object.entries(eventsByDay)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([day, list]) => (
          <li key={day}>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-main">{day}</span>
              <div className="flex-1" />
            </div>
            <div className="ml-4 mt-1 space-y-1">
              {list.map((x) => (
                <Link
                  key={x.id}
                  href={`/activity/${x.id}`}
                  className="text-black text-sm px-2 py-0.5 rounded-md w-fit inline-block hover:underline hover:text-main focus:outline-none focus:ring-2 focus:ring-main/40 cursor-pointer"
                  title={x.title}
                >
                  • {x.title}
                </Link>
              ))}
            </div>
          </li>
        ))}
    </ul>
  );
}
