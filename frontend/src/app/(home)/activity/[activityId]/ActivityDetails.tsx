"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ContactInfoView from "@/components/contactInfo";
import { formatDateThaiFromIso, formatTimeThaiFromIso } from "@/lib/datetime";
import { apiRoutes } from "@/lib/apiRoutes";
import AddToLifeButton from "@/components/AddToLifeButton";
import ErrorBox from "@/components/ui/ErrorBox";
import NotFoundPage from "@/components/ui/NotFoundPage";
import { Activity } from "lucide-react";
import ImageWithFallback from "@/components/ui/FallbackImage";
import SubActivityLoading from "./SubActivityLoading";

const FALLBACK_IMG = "/fallback_activity.png";

/* ===================== Types ===================== */
type Activity = {
  id: string;
  title?: string;
  description?: string;
  image_url?: string | null;
  image_path?: string | null;
  start_at?: string | null; // ISO
  end_at?: string | null; // ISO
  location_text?: string | null;
  contact_info?: any; // ให้ ContactInfoView จัดการภายใน
};

/* label/value บรรทัดข้อมูล */
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

/* ===================== Main Component ===================== */
export default function ActivityDetails({
  activityId,
}: {
  activityId: string;
}) {
  const [data, setData] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(5); // ใช้สำหรับกด "ลองใหม่"

  const fetchActivity = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiRoutes.getActivityById(activityId), {
          credentials: "include",
          cache: "no-store",
          signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        // ป้องกันกรณี body ใช้ซ้ำหรือ JSON พัง
        const text = await res.text();
        const json = text ? (JSON.parse(text) as Activity) : null;

        if (!signal.aborted) {
          setData(json);
        }
      } catch (err: unknown) {
        if (signal.aborted) return;
        console.error("Error fetching activity data:", err);
        setError("ไม่สามารถโหลดข้อมูลกิจกรรมได้");
        setData(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [activityId]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchActivity(controller.signal);
    return () => controller.abort();
  }, [fetchActivity, reloadKey]);

  const handleRetry = useCallback(() => {
    // กดลองใหม่ → เปลี่ยน key เพื่อ trigger useEffect
    setReloadKey((k) => k + 1);
  }, []);

  /* ===================== Derived values ===================== */
  const { title, imgSrc, dateText, timeText } = useMemo(() => {
    const title = data?.title || "ไม่มีชื่อกิจกรรม";
    const imgSrc = data?.image_url || data?.image_path || FALLBACK_IMG;

    const dateText = data?.start_at
      ? formatDateThaiFromIso(data.start_at)
      : "ไม่ระบุวันที่จัดกิจกรรม";

    const timeText =
      data?.start_at && data?.end_at
        ? `${formatTimeThaiFromIso(data.start_at)} - ${formatTimeThaiFromIso(
            data.end_at
          )}`
        : "ไม่ระบุเวลา";

    return { title, imgSrc, dateText, timeText };
  }, [data]);

  /* ===================== Render states ===================== */

  // ระหว่างโหลด

  // มี error
  if (error) {
    return (
      <div className="py-12">
        <ErrorBox message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (loading && !data) {
    return <SubActivityLoading />;
  }

  // โหลดเสร็จแต่ไม่มีข้อมูล
  if (!data) {
    return (
      <div className="py-12">
        <NotFoundPage />
      </div>
    );
  }

  // มีข้อมูลแล้ว
  return (
    <main className=" p-5 ">
      <section className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-2xl p-6 sm:p-10 ">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight mb-6">
          กิจกรรม “{title}”
        </h1>

        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] mb-8">
          <ImageWithFallback
            src={imgSrc || FALLBACK_IMG}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,..."
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
                <ContactInfoView info={data.contact_info} />
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <AddToLifeButton />
        </div>
      </section>
    </main>
  );
}
