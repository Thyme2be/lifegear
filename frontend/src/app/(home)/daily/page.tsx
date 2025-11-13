"use client";
import React, { useMemo, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { useDailyEvents } from "@/hooks/useDailyEvents";
import { apiRoutes } from "@/lib/apiRoutes";
import RecycleBinWidget from "@/components/RecycleBinWidget";
import DateNav from "@/components/DateNav";
import TimeLabel from "@/components/TimeLabel";
import type { CalendarEvent } from "@/types/calendar";
import type { DailyRow as Row } from "@/types/viewmodels";
import { useDateQuery } from "@/hooks/useDateQuery";
import { useAddedIds, useRemovedBin } from "@/hooks/useLocalIds";
import { useUpcomingThumbs } from "@/hooks/useUpcomingThumbs";
import { rowBg } from "@/components/daily/rowBg";
import HeaderGrid from "@/components/daily/HeaderGrid";
import MobileRow from "@/components/daily/MobileRow";
import RowCard from "@/components/daily/RowCard";

import {
  parseYmd,
  toHm,
  safeRangeHm,
  ymdFromISO,
  startOfDay,
  endOfDay,
  formatThaiRangeFromISO,
  isSameYmd,
  normalizeIsoToBangkok,
  formatThaiNoWeekday,
} from "@/lib/datetime";

export default function DailyPage() {
  const now = useNow(1000);
  const [refreshTick, setRefreshTick] = useState(0);

  React.useEffect(() => {
    const handler = () => setRefreshTick((k) => k + 1);
    window.addEventListener("lifgear:activity-added", handler);
    return () => window.removeEventListener("lifgear:activity-added", handler);
  }, []);

  const { dateStr, setDateQuery } = useDateQuery(now);

  const url = React.useMemo(() => {
    const base = apiRoutes.getMyEveryDailyEvents(dateStr);
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}rt=${refreshTick}`;
  }, [dateStr, refreshTick]);

  const { loading, error, events } = useDailyEvents(dateStr, url);

  const { removedIds, removedEntries, handleDelete, restoreOne, restoreAll } =
    useRemovedBin();
  const addedIds = useAddedIds();

  const {
    thumbs: upcomingThumbs,
    loading: thumbsLoading,
    error: thumbsError,
  } = useUpcomingThumbs(refreshTick);

  const rows: Row[] = useMemo(
    () =>
      events.map((ev: CalendarEvent) => {
        const startISO = ev.start_at;
        const endISO = ev.end_at;
        const valid =
          !Number.isNaN(new Date(startISO).valueOf()) &&
          !Number.isNaN(new Date(endISO).valueOf());
        const time = valid ? `${toHm(startISO)}-${toHm(endISO)}` : "—";

        // ⬇️ สร้างป้ายวันที่แบบที่ต้องการ
        const s = new Date(normalizeIsoToBangkok(startISO));
        const e = new Date(normalizeIsoToBangkok(endISO));
        const dateLabel = isSameYmd(s, e)
          ? // วันเดียว: ใช้ “10 พฤศจิกายน 2568”
            // (ถ้าอยากมีชื่อวัน ใช้ formatThaiWithWeekday ได้)
            formatThaiNoWeekday(s)
          : // หลายวัน: ใช้ “22–23 พฤศจิกายน 2568”
            formatThaiRangeFromISO(startISO, endISO);

        return {
          id: ev.id,
          title: ev.title,
          time,
          date: ymdFromISO(startISO),
          kind: ev.kind,
          startISO,
          endISO,
          dateLabel, // ⬅️ ส่งต่อให้การ์ดใช้
        };
      }),
    [events]
  );

  const visible = useMemo(
    () => rows.filter((r) => !removedIds.includes(r.id)),
    [rows, removedIds]
  );

  const todayRows = useMemo(() => {
    const selected = parseYmd(dateStr);
    const S = startOfDay(selected).getTime();
    const E = endOfDay(selected).getTime();

    const numStart = (r: Row) => new Date(r.startISO).getTime();
    const numEnd = (r: Row) => new Date(r.endISO).getTime();

    const classes = visible
      .filter((r) => r.kind === "class")
      .sort(
        (a, b) => numStart(a) - numStart(b) || a.title.localeCompare(b.title)
      );

    const actsInRange = visible
      .filter((r) => r.kind === "activity")
      .filter((r) => numStart(r) <= E && numEnd(r) >= S)
      .sort(
        (a, b) => numStart(a) - numStart(b) || a.title.localeCompare(b.title)
      );

    return [...classes, ...actsInRange];
  }, [visible, dateStr]);

  const upcomingRows: Row[] = useMemo(() => {
    const S = startOfDay(parseYmd(dateStr)).getTime();
    const todayActivityIds = new Set(
      todayRows.filter((r) => r.kind === "activity").map((r) => r.id)
    );

    const mapped: Row[] = upcomingThumbs.map((a) => {
      const startISO = a.start_at;
      const endISO = a.end_at ?? a.start_at;

      const s = new Date(normalizeIsoToBangkok(startISO));
      const e = new Date(normalizeIsoToBangkok(endISO));
      const dateLabel = isSameYmd(s, e)
        ? formatThaiNoWeekday(s)
        : formatThaiRangeFromISO(startISO, endISO);

      return {
        id: a.id,
        title: a.title,
        time: safeRangeHm(startISO, endISO),
        date: ymdFromISO(startISO),
        kind: "activity",
        startISO,
        endISO,
        slug: a.slug,
        status: a.status,
        dateLabel, // ⬅️ เพิ่ม
      };
    });

    return mapped
      .filter((r) => new Date(r.endISO || r.startISO).getTime() >= S)
      .filter((r) => !todayActivityIds.has(r.id))
      .filter((r) => !addedIds.includes(r.id))
      .sort(
        (a, b) =>
          new Date(a.startISO).getTime() - new Date(b.startISO).getTime() ||
          a.title.localeCompare(b.title)
      );
  }, [upcomingThumbs, dateStr, todayRows, addedIds]);

  return (
    <main className="bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <header className="w-full text-main mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            ตารางชีวิตประจำวัน
          </h1>
          <p className="font-bold text-xl sm:text-4xl">
            <TimeLabel dateYmd={dateStr} showClock={false} />
          </p>
          <div className="w-full mt-3">
            <DateNav value={dateStr} onChange={setDateQuery} />
          </div>
        </header>

        <section className="bg-white rounded-xl p-6">
          {/* Desktop: ตารางบน */}
          <HeaderGrid title="กิจกรรมของฉัน" />
          <div className="hidden sm:grid gap-2">
            {/* เออเรอร์ของตารางบน */}
            {!loading && error && (
              <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                โหลดข้อมูลไม่สำเร็จ: {error}
              </div>
            )}

            {/* โหลดเหมือนตารางล่าง */}
            {loading ? (
              <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                กำลังโหลดรายการวันนี้…
              </div>
            ) : todayRows.length === 0 ? (
              <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                ยังไม่มีรายการในวันนี้
              </div>
            ) : (
              todayRows.map((ev) => (
                <RowCard
                  key={ev.id}
                  row={ev}
                  onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                  enableDelete
                />
              ))
            )}
          </div>

          {/* Mobile: ตารางบน */}
          <div className="sm:hidden mt-4">
            {!loading && error && (
              <p className="text-center text-red-600">
                โหลดข้อมูลไม่สำเร็จ: {error}
              </p>
            )}

            {loading ? (
              <p className="text-gray-500 text-center">
                กำลังโหลดรายการวันนี้…
              </p>
            ) : todayRows.length === 0 ? (
              <p className="text-gray-500 text-center">
                ยังไม่มีรายการในวันนี้
              </p>
            ) : (
              <>
                <h2 className="text-center text-bf-btn font-semibold mb-2">
                  กิจกรรมของฉัน
                </h2>
                <ul role="list" className="space-y-0">
                  {todayRows.map((ev) => (
                    <li key={ev.id}>
                      <MobileRow
                        row={ev}
                        onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                        bgColor={rowBg(ev.kind)}
                        enableDelete
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Desktop: ตารางล่าง */}
          <div className="w-full mt-10">
            <HeaderGrid title="กิจกรรมแนะนำ" />
            <div className="hidden sm:grid gap-2">
              {!thumbsLoading && thumbsError && (
                <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                  {thumbsError}
                </div>
              )}
              {thumbsLoading ? (
                <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                  กำลังโหลดกิจกรรมแนะนำ…
                </div>
              ) : upcomingRows.length === 0 ? (
                <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                  ยังไม่มีกิจกรรมหลังจากวันนี้
                </div>
              ) : (
                upcomingRows.map((ev) => (
                  <RowCard key={ev.id} row={ev} enableDelete={false} />
                ))
              )}
            </div>
          </div>

          {/* Mobile: ตารางล่าง */}
          <div className="sm:hidden mt-4">
            {!thumbsLoading && thumbsError && (
              <p className="text-center text-red-600">{thumbsError}</p>
            )}
            {thumbsLoading ? (
              <p className="text-gray-500 text-center">
                กำลังโหลดกิจกรรมแนะนำ…
              </p>
            ) : upcomingRows.length === 0 ? (
              <p className="text-gray-500 text-center">
                ยังไม่มีกิจกรรมหลังจากวันนี้
              </p>
            ) : (
              <>
                <h2 className="text-center text-bf-btn font-semibold mb-2">
                  กิจกรรมแนะนำ
                </h2>
                <ul role="list" className="space-y-0">
                  {upcomingRows.map((ev) => (
                    <li key={ev.id}>
                      <MobileRow
                        row={ev}
                        onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                        bgColor={rowBg("activity")}
                        enableDelete={false}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Recycle Bin */}
          <div className="mt-6 w-full flex sm:justify-end">
            <RecycleBinWidget
              entries={removedEntries}
              loading={loading}
              onRestoreOne={restoreOne}
              onRestoreAll={restoreAll}
              className="w-full sm:w-auto"
              title="แสดงรายการที่ถูกลบ"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
