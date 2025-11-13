"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { apiRoutes } from "@/lib/apiRoutes";
import { fetchJson } from "@/lib/fetcher";
import type { ActivityDetailResponse } from "@/types/activities";
import { formatDateThaiFromIso, formatTimeThaiFromIso } from "@/lib/datetime";
import { isUuidV4, isAbortError, errorIncludesHttp } from "@/lib/is";

export function useActivityDetail(activityId: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ActivityDetailResponse | null>(null);

  // เตรียม URL คู่: byId กับ bySlug (ไม่เรียกทันที)
  const { byIdUrl, bySlugUrl } = useMemo(() => {
    return {
      byIdUrl: apiRoutes.getActivityById(activityId),
      bySlugUrl: apiRoutes.getActivityBySlug(activityId),
    };
  }, [activityId]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        if (!activityId || !activityId.trim()) {
          throw new Error("ไม่พบรหัสกิจกรรม");
        }

        // เลือกเส้นทางหลักตามรูปแบบ activityId; ถ้าพัง จะลองอีกเส้นทางให้เอง
        const primaryUrl = isUuidV4(activityId) ? byIdUrl : bySlugUrl;
        const secondaryUrl = isUuidV4(activityId) ? bySlugUrl : byIdUrl;

        try {
          const json = await fetchJson<ActivityDetailResponse>(primaryUrl, {
            signal,
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
          });
          setData(json);
        } catch (err) {
          // ถ้าเป็น Abort ก็โยนต่อ
          if (isAbortError(err)) throw err;

          // fallback อัตโนมัติเมื่อ primary เจอ 404/422
          if (errorIncludesHttp(err, 404) || errorIncludesHttp(err, 422)) {
            const json = await fetchJson<ActivityDetailResponse>(secondaryUrl, {
              signal,
              credentials: "include",
              headers: { Accept: "application/json" },
              cache: "no-store",
            });
            setData(json);
          } else {
            throw err;
          }
        }
      } catch (e) {
        if (isAbortError(e)) return;
        const msg =
          e instanceof Error ? e.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
        setError(msg);
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [activityId, byIdUrl, bySlugUrl]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    return () => ac.abort();
  }, [fetchData]);

  /** วันที่แบบไทย (ถ้าไม่มี start_at จะเป็น undefined) */
  const dateText = useMemo(
    () => (data?.start_at ? formatDateThaiFromIso(data.start_at) : undefined),
    [data?.start_at]
  );

  /** เวลา: ใช้ time_range ถ้ามี; ไม่งั้นใช้ start_at–end_at; ไม่งั้นใช้ start_at เดี่ยว */
  const timeText = useMemo(() => {
    if (data?.start_at && data?.end_at) {
      return `${formatTimeThaiFromIso(data.start_at)} - ${formatTimeThaiFromIso(
        data.end_at
      )}`;
    }
    if (data?.start_at) return formatTimeThaiFromIso(data.start_at);
    return undefined;
  }, [data?.start_at, data?.end_at]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    dateText,
    timeText,
  };
}
