"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import ContactInfoView from "@/components/contactInfo";
import { apiRoutes } from "@/lib/apiRoutes";
import { joinUrl } from "@/lib/url";
import { fetchJson } from "@/lib/fetcher";
import { formatDateThaiFromIso, formatTimeThaiFromIso } from "@/lib/datetime";
import type { ContactInfo } from "@/lib/contact";

/* ====================== Types ====================== */
export type Props = { activityId: string };

export type ActivityDetailResponse = {
  id: string;
  title: string;
  category?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  description?: string | null;
  start_at?: string | null; // ISO
  end_at?: string | null; // ISO
  time_range?: string | null;
  location_text?: string | null;
  contact_info?: ContactInfo | null;
};

export type Thumb = {
  id: string;
  title?: string;
  category?: string;
  image_path?: string | null;
  image_url?: string | null;
};

const FALLBACK_IMG = "/fallback_activity.png";

/* ====================== UI Partials ====================== */
function Skeleton() {
  return (
    <div className="animate-pulse mb-8" role="status" aria-live="polite">
      <div className="relative aspect-[16/9] w-full rounded-3xl bg-gray-200 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-700">
      <p className="mb-3 font-medium">เกิดข้อผิดพลาด: {message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-[#B30000] hover:bg-[#880000] text-white text-sm font-semibold"
      >
        ลองใหม่
      </button>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p>
      <b className="font-bold">{label} :</b> {children}
    </p>
  );
}

/* ====================== Page Client ====================== */
export default function SubActivityClient({ activityId }: Props) {
  const [thumb, setThumb] = useState<Thumb | null>(null);
  const [data, setData] = useState<ActivityDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Load last thumb from sessionStorage
  useEffect(() => {
    try {
      const key = `lg:lastActivityThumb:${activityId}`;
      const raw = sessionStorage.getItem(key);
      if (raw) setThumb(JSON.parse(raw) as Thumb);
    } catch {
      // ignore storage errors
    }
  }, [activityId]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        // ใช้ฟังก์ชัน by-id เป็นหลัก
        const primary = apiRoutes.getActivityById(activityId);
        const fallback = joinUrl(apiRoutes.getAllActivities, activityId);
        const url = primary || fallback;

        const json = await fetchJson<ActivityDetailResponse>(url, { signal });
        setData(json);

        // ... cache thumb เหมือนเดิม ...
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.name === "AbortError"
              ? null
              : e.message
            : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
        if (msg) setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [activityId]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    return () => ac.abort();
  }, [fetchData]);

  const title = data?.title ?? thumb?.title ?? "รายละเอียดกิจกรรม";

  const preferredSrc = useMemo(() => {
    return (
      data?.image_path ||
      data?.image_url ||
      thumb?.image_path ||
      thumb?.image_url ||
      FALLBACK_IMG
    );
  }, [data?.image_path, data?.image_url, thumb?.image_path, thumb?.image_url]);

  const displaySrc = imgError ? FALLBACK_IMG : preferredSrc;

  const dateText = useMemo(
    () => (data?.start_at ? formatDateThaiFromIso(data.start_at) : undefined),
    [data?.start_at]
  );

  const timeText = useMemo(() => {
    if (data?.time_range?.trim()) return data.time_range.trim()!;
    if (data?.start_at) return formatTimeThaiFromIso(data.start_at);
    return undefined;
  }, [data?.time_range, data?.start_at]);

  return (
    <main className="min-h-screen bg-[#F6F1E7] py-10 px-4">
      <section className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#730217] tracking-tight mb-6">
          กิจกรรม “{title}”
        </h1>

        {loading && <Skeleton />}

        {error && !loading && (
          <ErrorBox message={error} onRetry={() => fetchData()} />
        )}

        {!loading && !error && (
          <>
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] mb-8">
              <Image
                src={displaySrc}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
                onError={() => setImgError(true)}
              />
            </div>

            {data?.description?.trim() && (
              <p className="text-center text-[#730217] font-bold text-lg sm:text-xl leading-relaxed mb-8 max-w-md mx-auto px-1">
                “{data.description.trim()}”
              </p>
            )}

            <div className="text-black text-lg space-y-3 mb-10">
              <InfoRow label="วันที่จัดกิจกรรม">{dateText}</InfoRow>
              <InfoRow label="เวลาที่จัดกิจกรรม">{timeText}</InfoRow>
              <InfoRow label="สถานที่จัดกิจกรรม">{data?.location_text}</InfoRow>

              {data?.contact_info != null && (
                <div>
                  <b className="font-bold">รายละเอียดวิธีการสมัคร :</b>
                  <span className="mt-2">
                    <ContactInfoView info={data.contact_info} />
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-[#B30000] hover:bg-[#880000] text-white font-bold shadow-md transition cursor-pointer"
                onClick={() => alert("เพิ่มลงในตารางชีวิต (ตัวอย่าง)")}
              >
                เพิ่มลงในตารางชีวิต
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
