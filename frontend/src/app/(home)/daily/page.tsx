// app/(home)/daily/page.tsx
"use client";
import React, { useMemo, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { useDailyEvents } from "@/hooks/useDailyEvents";
import { apiRoutes } from "@/lib/apiRoutes";
import RecycleBinWidget from "@/components/RecycleBinWidget";
import DateNav from "@/components/DateNav";
import TimeLabel from "@/components/TimeLabel";
import DailyActionCell from "@/components/DailyActionCell";
import type { CalendarEvent } from "@/types/calendar";
import type { DailyRow as Row } from "@/types/viewmodels";
import { useDateQuery } from "@/hooks/useDateQuery";
import { useAddedIds, useRemovedBin } from "@/hooks/useLocalIds";
import { useUpcomingThumbs } from "@/hooks/useUpcomingThumbs";

import {
  parseYmd,
  toHm,
  safeRangeHm,
  ymdFromISO,
  formatThaiDate,
  startOfDay,
  endOfDay,
  formatThaiRangeFromISO,
} from "@/lib/datetime";

const rowBg = (kind: Row["kind"], index: number) =>
  kind === "activity"
    ? index % 2 === 0
      ? "bg-[#FFC26D]"
      : "bg-[#FF975E]"
    : index % 2 === 0
    ? "bg-[#8BD8FF]"
    : "bg-[#8CBAFF]";

/** Header grid (desktop) */
const HeaderGrid = React.memo(function HeaderGrid({ title }: { title: string }) {
  return (
    <div className="hidden sm:grid grid-cols-4 font-semibold text-black mb-2 normal-text">
      <div className="text-center text-bf-btn">{title}</div>
      <div className="text-center">กำหนดการ</div>
      <div className="text-center">ระยะเวลา</div>
      <div className="text-center">ดำเนินการ</div>
    </div>
  );
});

function MobileRow({
  row,
  bgColor,
  onDelete,
  enableDelete = true,
}: {
  row: Row;
  bgColor: string;
  onDelete: (id: string) => void;
  enableDelete?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const d = parseYmd(row.date);
  const panelId = `row-panel-${row.id}`;
  const btnId = `row-btn-${row.id}`;

  return (
    <div className={`border rounded-md mb-3 overflow-hidden sm:hidden ${bgColor}`}>
      <button
        id={btnId}
        className="w-full px-4 py-3 bg-opacity-80 flex justify-between items-center font-semibold"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="truncate">{row.title}</span>
        <span className="text-xl text-gray-700">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          className="px-4 py-2 bg-white space-y-2"
        >
          <p>
            <span className="font-semibold">วัน: </span>
            {formatThaiDate(d)}
          </p>
          <p>
            <span className="font-semibold">เวลา: </span>
            {row.time}
          </p>

          <DailyActionCell
            row={row}
            source="mine"
            onDelete={onDelete}
            enableDelete={enableDelete}
            size="sm"
            align="start"
          />
        </div>
      )}
    </div>
  );
}

export default function DailyPage() {
  const now = useNow(1000);
  const [refreshTick, setRefreshTick] = useState(0);

  // sync เมื่อยิง event lifgear:activity-added จากที่อื่น
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
        return {
          id: ev.id,
          title: ev.title,
          time,
          date: ymdFromISO(startISO),
          kind: ev.kind,
          startISO,
          endISO,
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
      .sort((a, b) => numStart(a) - numStart(b) || a.title.localeCompare(b.title));

    const actsInRange = visible
      .filter((r) => r.kind === "activity")
      .filter((r) => numStart(r) <= E && numEnd(r) >= S)
      .sort((a, b) => numStart(a) - numStart(b) || a.title.localeCompare(b.title));

    return [...classes, ...actsInRange];
  }, [visible, dateStr]);

  const upcomingRows: Row[] = useMemo(() => {
    const S = startOfDay(parseYmd(dateStr)).getTime();
    const todayActivityIds = new Set(
      todayRows.filter((r) => r.kind === "activity").map((r) => r.id)
    );

    const mapped: Row[] = upcomingThumbs.map((a) => ({
      id: a.id,
      title: a.title,
      time: safeRangeHm(a.start_at, a.end_at ?? null),
      date: ymdFromISO(a.start_at),
      kind: "activity",
      startISO: a.start_at,
      endISO: a.end_at ?? a.start_at,
      slug: a.slug,
      status: a.status,
    }));

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
          <h1 className="text-2xl sm:text-3xl font-semibold">ตารางชีวิตประจำวัน</h1>
          <p className="font-bold text-xl sm:text-4xl">
            <TimeLabel />
          </p>
          <div className="w-full mt-3">
            <DateNav value={dateStr} onChange={setDateQuery} />
          </div>
        </header>

        <section className="bg-white rounded-xl p-6">
          {/* Loading / Error */}
          {loading && <div className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล…</div>}
          {!loading && error && (
            <div className="text-center py-8 text-red-600">โหลดข้อมูลไม่สำเร็จ: {error}</div>
          )}

          {/* Desktop: ตารางบน */}
          <HeaderGrid title="กิจกรรมของฉัน" />
          <div className="hidden sm:grid gap-2">
            {!loading && todayRows.length === 0 ? (
              <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                ยังไม่มีรายการในวันนี้
              </div>
            ) : (
              todayRows.map((ev, idx) => {
                const d = parseYmd(ev.date);
                const bg = rowBg(ev.kind, idx);
                const sameDay = ymdFromISO(ev.startISO) === ymdFromISO(ev.endISO);
                const scheduleLabel = sameDay
                  ? formatThaiDate(d)
                  : formatThaiRangeFromISO(ev.startISO, ev.endISO);
                return (
                  <div
                    key={ev.id}
                    className={`grid grid-cols-4 items-center rounded-md ${bg} hover:brightness-105 transition`}
                  >
                    <div className="p-3 text-center font-medium truncate">{ev.title}</div>
                    <div className="p-3 text-center">
                      <time>{scheduleLabel}</time>
                    </div>
                    <div className="p-3 text-center">
                      <time>{ev.time}</time>
                    </div>
                    <div className="p-3">
                      <DailyActionCell
                        row={ev}
                        source="mine"
                        onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                        enableDelete
                        size="sm"
                        align="center"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mobile: ตารางบน */}
          <div className="sm:hidden mt-4">
            {loading ? (
              <p className="text-gray-500 text-center">กำลังโหลดข้อมูล…</p>
            ) : todayRows.length === 0 ? (
              <p className="text-gray-500 text-center">ยังไม่มีรายการในวันนี้</p>
            ) : (
              <>
                <h2 className="text-center text-bf-btn font-semibold mb-2">กิจกรรมของฉัน</h2>
                <ul role="list" className="space-y-0">
                  {todayRows.map((ev, idx) => (
                    <li key={ev.id}>
                      <MobileRow
                        row={ev}
                        onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                        bgColor={rowBg(ev.kind, idx)}
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
                upcomingRows.map((ev, idx) => {
                  const d = parseYmd(ev.date);
                  const bg = rowBg("activity", idx);
                  const sameDay = ymdFromISO(ev.startISO) === ymdFromISO(ev.endISO);
                  const scheduleLabel = sameDay
                    ? formatThaiDate(d)
                    : formatThaiRangeFromISO(ev.startISO, ev.endISO);
                  return (
                    <div
                      key={ev.id}
                      className={`grid grid-cols-4 items-center rounded-md ${bg} hover:brightness-105 transition`}
                    >
                      <div className="p-3 text-center font-medium truncate">{ev.title}</div>
                      <div className="p-3 text-center">
                        <time>{scheduleLabel}</time>
                      </div>
                      <div className="p-3 text-center">
                        <time>{ev.time}</time>
                      </div>
                      <div className="p-3">
                        <DailyActionCell row={ev} enableDelete={false} size="sm" align="center" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile: ตารางล่าง */}
          <div className="sm:hidden mt-4">
            {!thumbsLoading && thumbsError && (
              <p className="text-center text-red-600">{thumbsError}</p>
            )}
            {thumbsLoading ? (
              <p className="text-gray-500 text-center">กำลังโหลดกิจกรรมแนะนำ…</p>
            ) : upcomingRows.length === 0 ? (
              <p className="text-gray-500 text-center">ยังไม่มีกิจกรรมหลังจากวันนี้</p>
            ) : (
              <>
                <h2 className="text-center text-bf-btn font-semibold mb-2">กิจกรรมแนะนำ</h2>
                <ul role="list" className="space-y-0">
                  {upcomingRows.map((ev, idx) => (
                    <li key={ev.id}>
                      <MobileRow
                        row={ev}
                        onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                        bgColor={rowBg("activity", idx)}
                        enableDelete={false}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ถังรีไซเคิล (RecycleBinWidget รองรับ uncontrolled อยู่แล้ว) */}
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
