// src/hooks/useMonthlyEvents.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import type { calendar } from "@/types/calendar";
import { adaptCalendar } from "@/lib/calendar-adapter";
import type { CalendarEvent } from "@/types/calendar";
import { ymdInBangkok } from "@/lib/datetime";
import { isAbortError } from "@/lib/is";

export function useMonthlyEvents(year: number, month0: number, url: string) {
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

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as calendar;
        setEvents(adaptCalendar(data));
      } catch (e: unknown) {
        if (isAbortError(e)) return;
        const msg = e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [year, month0, url]);

  const eventsByDay = useMemo<Record<number, CalendarEvent[]>>(() => {
    const map: Record<number, CalendarEvent[]> = {};

    for (const ev of events) {
      const ymd = ymdInBangkok(ev.start_at);
      if (!ymd) continue;
      const { y, m0, d } = ymd;
      if (y !== year || m0 !== month0) continue;
      (map[d] ??= []).push(ev);
    }

    // ใช้ Object.keys เพื่อหลีกเลี่ยงปัญหา key เป็น string ใน for..in
    for (const k of Object.keys(map)) {
      const day = Number(k);
      const arr = map[day];
      arr.sort((a, b) => {
        const ak = a.kind === "class" ? 0 : 1;
        const bk = b.kind === "class" ? 0 : 1;
        if (ak !== bk) return ak - bk;

        const at = new Date(a.start_at).getTime();
        const bt = new Date(b.start_at).getTime();
        if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
        if (Number.isNaN(at)) return 1;
        if (Number.isNaN(bt)) return -1;
        return at - bt;
      });
    }

    return map;
  }, [events, year, month0]);

  return { loading, error, events, eventsByDay };
}
