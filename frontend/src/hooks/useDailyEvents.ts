// src/hooks/useDailyEvents.ts
"use client";
import { useEffect, useMemo, useState } from "react";
import type { calendar, CalendarEvent } from "@/types/calendar";
import { adaptCalendar } from "@/lib/calendar-adapter";
import { isAbortError } from "@/lib/is";

function dayRangeUTC(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
  return { start, end };
}

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
        const all = adaptCalendar(data);
        setEvents(all);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [dateStr, url]);

  // ✅ แสดง event ที่ช่วงเวลาทับซ้อน "ทั้งวัน" นั้น (รองรับกิจกรรมยาวหลายวัน)
  const eventsOfTheDay = useMemo(() => {
    const { start, end } = dayRangeUTC(dateStr);
    return events.filter((ev) => {
      const s = new Date(ev.start_at);
      const e = new Date(ev.end_at);
      return e >= start && s <= end;
    });
  }, [events, dateStr]);

  return { loading, error, events: eventsOfTheDay };
}
