// src/hooks/useUpcomingThumbs.ts
"use client";

import { useEffect, useState } from "react";
import { apiRoutes } from "@/lib/apiRoutes";
import type { ActivityThumbnailResponse } from "@/types/activities";

export function useUpcomingThumbs(refreshKey: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<ActivityThumbnailResponse[]>([]);

  useEffect(() => {
    const ac = new AbortController();

    const getErrorMessage = (e: unknown) =>
      e instanceof Error ? e.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";

    async function fetchThumbs(url: string) {
      const res = await fetch(url, { credentials: "include", signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as ActivityThumbnailResponse[];
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `${apiRoutes.getAllActivitiesThumbnails}?status=upcoming`;
        const data = await fetchThumbs(url);
        setThumbs(data.filter((a) => a.status === "upcoming"));
      } catch {
        try {
          if (!ac.signal.aborted) {
            const all = await fetchThumbs(apiRoutes.getAllActivitiesThumbnails);
            setThumbs(all.filter((a) => a.status === "upcoming"));
          }
        } catch (err2) {
          if (!ac.signal.aborted) setError(getErrorMessage(err2));
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, [refreshKey]);

  return { thumbs, loading, error };
}
