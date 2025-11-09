// app/(home)/activity/[activityId]/ActivityDetails.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContactInfoView from "@/components/contactInfo";
import { formatDateThaiFromIso, formatTimeThaiFromIso } from "@/lib/datetime";
import { apiRoutes } from "@/lib/apiRoutes";
import AddToLifeButton from "@/components/AddToLifeButton";
import SubActivityNotFoundPage from "@/components/ui/NotFoundPage";
import ImageWithFallback from "@/components/ui/FallbackImage";
import SubActivityLoading from "./SubActivityLoading";
import ErrorFetchDisplay from "./errorFetchDisplay";
import type { ActivityDetailResponse } from "@/types/activities";

const FALLBACK_IMG = "/fallback_activity.png";

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

export default function ActivityDetails({ activityId }: { activityId: string }) {
  const searchParams = useSearchParams();
  const fromMine = (searchParams.get("src") ?? "") === "mine";

  // ✅ กัน double-encoding เช่น .../%2520... ด้วยการ decode ก่อน
  const normalizedId = useMemo(() => decodeURIComponent(activityId), [activityId]);

  const [data, setData] = useState<ActivityDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchActivity = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiRoutes.getActivityById(normalizedId), {
          credentials: "include",
          cache: "no-store",
          signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          // แยก 404 เป็น not-found ให้ UI แสดงเพจไม่พบ
          if (res.status === 404) {
            if (!signal.aborted) {
              setData(null);
              setError(null);
            }
            return;
          }
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const json = (await res.json()) as ActivityDetailResponse;
        if (!signal.aborted) setData(json ?? null);
      } catch (err) {
        if (signal.aborted) return;
        console.error("Error fetching activity data:", err);
        setError("ไม่สามารถโหลดข้อมูลกิจกรรมได้");
        setData(null);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [normalizedId]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchActivity(controller.signal);
    return () => controller.abort();
  }, [fetchActivity, reloadKey]);

  const handleRetry = useCallback(() => setReloadKey((k) => k + 1), []);

  const { title, imgSrc, dateText, timeText } = useMemo(() => {
    const title = data?.title || "ไม่มีชื่อกิจกรรม";
    const imgSrc = data?.image_path || FALLBACK_IMG;

    const dateText = data?.start_at
      ? formatDateThaiFromIso(data.start_at)
      : "ไม่ระบุวันที่จัดกิจกรรม";

    let timeText = "ไม่ระบุเวลา";
    if (data?.start_at && data?.end_at) {
      timeText = `${formatTimeThaiFromIso(data.start_at)} - ${formatTimeThaiFromIso(
        data.end_at
      )}`;
    } else if (data?.start_at) {
      timeText = formatTimeThaiFromIso(data.start_at) ?? "ไม่ระบุเวลา";
    }

    return { title, imgSrc, dateText, timeText };
  }, [data]);

  // ===== Render states =====
  if (loading && !data) return <SubActivityLoading />;

  if (error) {
    return (
      <div className="py-12">
        <ErrorFetchDisplay error={new Error(error)} reset={handleRetry} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12">
        <SubActivityNotFoundPage />
      </div>
    );
  }

  // ===== Render =====
  return (
    <section className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-2xl p-6 sm:p-10 ">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight mb-6">
        กิจกรรม “{title}”
      </h1>

      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] mb-8">
        <ImageWithFallback
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        />
      </div>

      {data.description && (
        <p className="text-center text-main font-bold text-lg sm:text-xl leading-relaxed mb-8 max-w-md mx-auto px-1">
          “{data.description}”
        </p>
      )}

      <div className="text-black text-lg space-y-3 mb-10">
        <InfoRow label="วันที่จัดกิจกรรม">{dateText}</InfoRow>
        <InfoRow label="เวลาที่จัดกิจกรรม">{timeText}</InfoRow>
        <InfoRow label="สถานที่จัดกิจกรรม">
          {data.location_text || "ไม่ระบุสถานที่"}
        </InfoRow>

        {data.contact_info && (
          <div>
            <b className="font-bold">รายละเอียดวิธีการสมัคร</b>
            <span className="mt-2 block">
              {Array.isArray(data.contact_info) ? (
                data.contact_info.map((info, idx) => (
                  <ContactInfoView key={idx} info={info} />
                ))
              ) : (
                <ContactInfoView info={data.contact_info} />
              )}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <AddToLifeButton
          activityId={normalizedId}           
          startAt={data.start_at ?? undefined}
          endAt={data.end_at ?? undefined}
          forceDisabled={fromMine}  
          onDone={() => {
            /* ตามเดิม */
          }}
        />
      </div>
    </section>
  );
}
