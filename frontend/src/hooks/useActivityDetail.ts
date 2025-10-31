"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { apiRoutes } from "@/lib/apiRoutes";
import { joinUrl } from "@/lib/url";
import { fetchJson } from "@/lib/fetcher";
import type { ActivityDetailResponse } from "@/types/subActivity";
import { formatDateThaiFromIso, formatTimeThaiFromIso } from "@/lib/datetime";

export function useActivityDetail(activityId: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ActivityDetailResponse | null>(null);

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

  const dateText = useMemo(
    () => (data?.start_at ? formatDateThaiFromIso(data.start_at) : undefined),
    [data?.start_at]
  );

  const timeText = useMemo(() => {
    if (data?.time_range?.trim()) return data.time_range.trim()!;
    if (data?.start_at) return formatTimeThaiFromIso(data.start_at);
    return undefined;
  }, [data?.time_range, data?.start_at]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    dateText,
    timeText,
  };
}
