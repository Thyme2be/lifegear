// app/(home)/daily/page.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  memo,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import RecycleBinWidget from "@/components/RecycleBinWidget";
import DateNav from "@/components/DateNav";
import TimeLabel from "@/components/TimeLabel";
import DailyActionCell from "@/components/DailyActionCell";

import { useNow } from "@/hooks/useNow";
import { useDailyEvents } from "@/hooks/useDailyEvents";
import { apiRoutes } from "@/lib/apiRoutes";
import { toYmdLocal, parseYmd, THAI_MONTHS } from "@/lib/datetime";
import {
  readRemovedIds,
  readRemovedEntries,
  addRemovedEntry,
  removeRemovedId,
  clearRemovedIds,
  purgeExpired,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

import type { CalendarEvent } from "@/types/calendar";
import type { ActivityThumbnailResponse } from "@/types/activities";
import type { DailyRow as Row } from "@/types/viewmodels";

/* ===================== Pure utils ===================== */

const ADDED_IDS_KEY = "lifgear:added-ids";

function toHm(iso: string) {
  const t = new Date(iso);
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function safeRangeHm(startISO: string, endISO?: string | null) {
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : null;
  if (isNaN(start.getTime())) return "—";
  if (end && !isNaN(end.getTime())) return `${toHm(startISO)}-${toHm(endISO!)}`;
  return `${toHm(startISO)}-—`;
}

function ymdFromISO(iso: string) {
  return toYmdLocal(new Date(iso));
}

function readAddedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ADDED_IDS_KEY) || "[]");
  } catch {
    return [];
  }
}

function dayStart(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function dayEnd(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

const formatThaiDate = (d: Date) =>
  `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

function formatThaiRangeFromISO(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const sd = s.getDate();
  const sm = THAI_MONTHS[s.getMonth()];
  const sy = s.getFullYear() + 543;
  const ed = e.getDate();
  const em = THAI_MONTHS[e.getMonth()];
  const ey = e.getFullYear() + 543;
  return s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()
    ? `${sd}–${ed} ${sm} ${sy}`
    : `${sd} ${sm} ${sy} – ${ed} ${em} ${ey}`;
}

function rowBg(kind: Row["kind"], index: number) {
  if (kind === "activity")
    return index % 2 === 0 ? "bg-[#FFC26D]" : "bg-[#FF975E]";
  return index % 2 === 0 ? "bg-[#8BD8FF]" : "bg-[#8CBAFF]";
}

/* ===================== MobileRow ===================== */
const MobileRow = memo(function MobileRow({
  row,
  bgColor,
  onDelete,
  enableDelete = true,
}: {
  row: Row;
  bgColor: string;
  onDelete: (id: string) => void;
  /** ปิด/เปิดปุ่มลบในมุมมองโมบาย */
  enableDelete?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const d = parseYmd(row.date);
  const panelId = `row-panel-${row.id}`;
  const btnId = `row-btn-${row.id}`;

  return (
    <div
      className={`border rounded-md mb-3 overflow-hidden sm:hidden ${bgColor}`}
    >
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

          {/* ใช้ ActionCell เป็นที่เดียวกับเดสก์ท็อป */}
          <DailyActionCell
            row={row}
            source="mine" // ✅
            onDelete={(id: string) => onDelete(id)}
            enableDelete={enableDelete}
            size="sm"
            align="start"
          />
        </div>
      )}
    </div>
  );
});

/* ===================== Page ===================== */
export default function DailyPage() {
  const now = useNow(1000);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    const handler = () => setRefreshTick((k) => k + 1);
    window.addEventListener("lifgear:activity-added", handler);
    return () => window.removeEventListener("lifgear:activity-added", handler);
  }, []);

  const [addedIds, setAddedIds] = useState<string[]>(() => readAddedIds());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADDED_IDS_KEY) setAddedIds(readAddedIds());
      if (e.key === REMOVED_IDS_KEY) {
        purgeExpired(1);
        setRemovedIds(readRemovedIds());
        setRemovedEntries(readRemovedEntries());
      }
    };
    window.addEventListener("storage", onStorage);

    const onAdded = () => setAddedIds(readAddedIds());
    window.addEventListener("lifgear:activity-added", onAdded);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lifgear:activity-added", onAdded);
    };
  }, []);

  const dateStr = useMemo(() => {
    const qs = (searchParams?.get("date") || "").trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(qs) ? qs : toYmdLocal(now);
  }, [searchParams, now]);

  const setDateQuery = useCallback(
    (nextYmd: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("date", nextYmd);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const url = useMemo(() => {
    const base = apiRoutes.getMyEveryDailyEvents(dateStr);
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}rt=${refreshTick}`;
  }, [dateStr, refreshTick]);

  const { loading, error, events } = useDailyEvents(dateStr, url);

  const [removedIds, setRemovedIds] = useState<string[]>(() =>
    readRemovedIds()
  );
  const [removedEntries, setRemovedEntries] = useState(() =>
    readRemovedEntries()
  );

  const [showBin, setShowBin] = useState(false);

  const purgeIvRef = useRef<number | null>(null);
  useEffect(() => {
    purgeExpired(1);
    setRemovedIds(readRemovedIds());
    setRemovedEntries(readRemovedEntries());

    if (purgeIvRef.current) window.clearInterval(purgeIvRef.current);
    purgeIvRef.current = window.setInterval(() => {
      purgeExpired(1);
      setRemovedIds(readRemovedIds());
      setRemovedEntries(readRemovedEntries());
    }, 15 * 60 * 1000);

    return () => {
      if (purgeIvRef.current) window.clearInterval(purgeIvRef.current);
    };
  }, []);

  const handleDelete = useCallback(
    (id: string, title?: string, kind?: Row["kind"]) => {
      addRemovedEntry({ id, title, kind });
      setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setRemovedEntries(readRemovedEntries());
    },
    []
  );

  const restoreOne = useCallback((id: string) => {
    removeRemovedId(id);
    setRemovedIds(readRemovedIds());
    setRemovedEntries(readRemovedEntries());
  }, []);

  const restoreAll = useCallback(() => {
    clearRemovedIds();
    setRemovedIds([]);
    setRemovedEntries([]);
  }, []);

  const rows: Row[] = useMemo(
    () =>
      events.map((ev: CalendarEvent) => {
        const startISO = ev.start_at;
        const endISO = ev.end_at;
        const start = new Date(startISO);
        const end = new Date(endISO);

        const safeTime =
          isNaN(start.getTime()) || isNaN(end.getTime())
            ? "—"
            : `${toHm(startISO)}-${toHm(endISO)}`;

        return {
          id: ev.id,
          title: ev.title,
          time: safeTime,
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
    const S = dayStart(selected).getTime();
    const E = dayEnd(selected).getTime();

    const classes = visible
      .filter((r) => r.kind === "class")
      .sort((a, b) => a.time.localeCompare(b.time));

    const actsInRange = visible
      .filter((r) => r.kind === "activity")
      .filter((r) => {
        const st = new Date(r.startISO).getTime();
        const en = new Date(r.endISO).getTime();
        return st <= E && en >= S;
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    return [...classes, ...actsInRange];
  }, [visible, dateStr]);

  const [thumbsLoading, setThumbsLoading] = useState(true);
  const [thumbsError, setThumbsError] = useState<string | null>(null);
  const [upcomingThumbs, setUpcomingThumbs] = useState<
    ActivityThumbnailResponse[]
  >([]);

 useEffect(() => {
  const ac = new AbortController();

  const getErrorMessage = (e: unknown) =>
    e instanceof Error ? e.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";

  async function fetchThumbs(
    url: string,
    signal: AbortSignal
  ): Promise<ActivityThumbnailResponse[]> {
    const res = await fetch(url, { credentials: "include", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ActivityThumbnailResponse[] = await res.json();
    return data;
  }

  async function loadUpcoming() {
    setThumbsLoading(true);
    setThumbsError(null);

    try {
      // ลองเรียกเฉพาะ upcoming ก่อน
      const url = `${apiRoutes.getAllActivitiesThumbnails}?status=upcoming`;
      const data = await fetchThumbs(url, ac.signal);
      setUpcomingThumbs(data.filter((a) => a.status === "upcoming"));
    } catch {
      // ถ้าล้มเหลว (ยกเว้นถูก abort) ให้ fallback ไปดึงทั้งหมด
      try {
        if (!ac.signal.aborted) {
          const all = await fetchThumbs(apiRoutes.getAllActivitiesThumbnails, ac.signal);
          setUpcomingThumbs(all.filter((a) => a.status === "upcoming"));
        }
      } catch (err2: unknown) {
        if (!ac.signal.aborted) {
          setThumbsError(getErrorMessage(err2) || "โหลดกิจกรรมแนะนำไม่สำเร็จ");
        }
      }
    } finally {
      if (!ac.signal.aborted) setThumbsLoading(false);
    }
  }

  loadUpcoming();
  return () => ac.abort();
}, [refreshTick]);

  const upcomingRows = useMemo(() => {
    const selected = parseYmd(dateStr);
    const S = dayStart(selected).getTime();

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
          <h1 className="text-2xl sm:text-3xl font-semibold">
            ตารางชีวิตประจำวัน
          </h1>
          <p className="font-bold text-xl sm:text-4xl">
            <TimeLabel />
          </p>
          <div className="w-full mt-3">
            <DateNav value={dateStr} onChange={setDateQuery} />
          </div>
        </header>

        {/* กล่องหลัก */}
        <section className="bg-white rounded-xl p-6">
          {/* Loading / Error */}
          {loading && (
            <div className="text-center py-8 text-gray-500">
              กำลังโหลดข้อมูล…
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-8 text-red-600">
              โหลดข้อมูลไม่สำเร็จ: {error}
            </div>
          )}

          {/* Header (Desktop) */}
          <div className="hidden sm:grid grid-cols-4 font-semibold text-black mb-2 normal-text">
            <div className="text-center text-bf-btn">กิจกรรมของฉัน</div>
            <div className="text-center">กำหนดการ</div>
            <div className="text-center">ระยะเวลา</div>
            <div className="text-center">ดำเนินการ</div>
          </div>

          {/* Rows (Desktop) */}
          <div className="hidden sm:grid gap-2">
            {!loading && todayRows.length === 0 ? (
              <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                ยังไม่มีรายการในวันนี้
              </div>
            ) : (
              todayRows.map((ev, idx) => {
                const d = parseYmd(ev.date);
                const bg = rowBg(ev.kind, idx);
                const sameDay =
                  ymdFromISO(ev.startISO) === ymdFromISO(ev.endISO);
                const scheduleLabel = sameDay
                  ? formatThaiDate(d)
                  : formatThaiRangeFromISO(ev.startISO, ev.endISO);
                return (
                  <div
                    key={ev.id}
                    className={`grid grid-cols-4 items-center rounded-md ${bg} hover:brightness-105 transition`}
                  >
                    <div className="p-3 text-center font-medium truncate">
                      {ev.title}
                    </div>
                    <div className="p-3 text-center">
                      <time>{scheduleLabel}</time>
                    </div>
                    <div className="p-3 text-center">
                      <time>{ev.time}</time>
                    </div>
                    <div className="p-3">
                      <DailyActionCell
                        row={ev}
                        source="mine" // ✅ บอกว่ามาจากของฉัน
                        onDelete={(id: string) =>
                          handleDelete(id, ev.title, ev.kind)
                        }
                        enableDelete={true}
                        size="sm"
                        align="center"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rows (Mobile Accordion) */}
          <div className="sm:hidden mt-4">
            {loading ? (
              <p className="text-gray-500 text-center">กำลังโหลดข้อมูล…</p>
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
                  {todayRows.map((ev, idx) => (
                    <li key={ev.id}>
                      <MobileRow
                        row={ev}
                        onDelete={(id) => handleDelete(id, ev.title, ev.kind)}
                        bgColor={rowBg(ev.kind, idx)}
                        enableDelete={true} // โมบายของฉัน: ลบได้
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ===== ตารางล่าง: กิจกรรมหลังจากวันนั้น ===== */}
          <div className="w-full mt-10">
            <div className="hidden sm:grid grid-cols-4 font-semibold text-black mb-2 normal-text">
              <div className="text-center text-bf-btn">กิจกรรมแนะนำ</div>
              <div className="text-center">กำหนดการ</div>
              <div className="text-center">ระยะเวลา</div>
              <div className="text-center">ดำเนินการ</div>
            </div>

            {/* Desktop */}
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
                  const sameDay =
                    ymdFromISO(ev.startISO) === ymdFromISO(ev.endISO);
                  const scheduleLabel = sameDay
                    ? formatThaiDate(d)
                    : formatThaiRangeFromISO(ev.startISO, ev.endISO);

                  return (
                    <div
                      key={ev.id}
                      className={`grid grid-cols-4 items-center rounded-md ${bg} hover:brightness-105 transition`}
                    >
                      <div className="p-3 text-center font-medium truncate">
                        {ev.title}
                      </div>
                      <div className="p-3 text-center">
                        <time>{scheduleLabel}</time>
                      </div>
                      <div className="p-3 text-center">
                        <time>{ev.time}</time>
                      </div>
                      <div className="p-3">
                        <DailyActionCell
                          row={ev}
                          enableDelete={false} // “กิจกรรมแนะนำ” ไม่ให้ลบ
                          size="sm"
                          align="center"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile: กิจกรรมแนะนำ */}
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
                  {upcomingRows.map((ev, idx) => {
                    return (
                      <li key={ev.id}>
                        <MobileRow
                          row={ev}
                          onDelete={(id: string) =>
                            handleDelete(id, ev.title, ev.kind)
                          }
                          bgColor={rowBg("activity", idx)}
                          enableDelete={false}
                        />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          {/* ถังรีไซเคิล */}
          <div className="mt-6 w-full flex sm:justify-end">
            <RecycleBinWidget
              entries={removedEntries}
              loading={loading}
              onRestoreOne={restoreOne}
              onRestoreAll={restoreAll}
              show={showBin}
              onToggle={setShowBin}
              className="w-full sm:w-auto"
              title="แสดงรายการที่ถูกลบ"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
