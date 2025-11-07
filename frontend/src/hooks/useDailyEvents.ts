// src/hooks/useDailyEvents.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import type { calendar, CalendarEvent } from "@/types/calendar";
import { adaptCalendar } from "@/lib/calendar-adapter";
import { ymdInBangkok } from "@/lib/datetime";
import { isAbortError } from "@/lib/is";

export function useDailyEvents(dateStr: string, url: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const data = (await res.json()) as calendar;
        const all = adaptCalendar(data); // CalendarEvent[]
        setEvents(all);
      } catch (e: unknown) {
        if (isAbortError(e)) return;
        const msg = e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [dateStr, url]);

  // ให้เฉพาะของ "วันนั้น" จริง ๆ (กันกรณี API ส่งมาหลายวัน)
  const eventsOfTheDay = useMemo(() => {
    const [y, m, d] = dateStr.split("-").map((n) => Number(n));
    const m0 = m - 1;
    return events.filter((ev) => {
      const ymd = ymdInBangkok(ev.start_at);
      return ymd && ymd.y === y && ymd.m0 === m0 && ymd.d === d;
    });
  }, [events, dateStr]);

  return { loading, error, events: eventsOfTheDay };
}
