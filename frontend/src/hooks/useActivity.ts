// src/hooks/useActivity.ts
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios, { AxiosError } from "axios";
import type { ActivityThumbnailResponse } from "@/types/activities";
import { ActivityCategory } from "@/lib/enums/activity";
import { apiRoutes } from "@/lib/apiRoutes";
import { normalizeCategory } from "@/utils/activityUtils";
/* ✅ นำเข้า TimeFilter จาก SearchBox */
import { TimeFilter } from "@/components/SearchBox";
/* ✅ ใช้ตัวช่วยเวลา (Bangkok) ที่โปรเจกต์มีอยู่ */
import { ymdInBangkok } from "@/lib/datetime";

type MaybeCategory = { category?: unknown; category_code?: unknown };
type ServerError = { message?: string; detail?: string; error?: string };

const FILTER_OPTIONS = Object.values(ActivityCategory) as ActivityCategory[];

function getServerMessage(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const d = data as ServerError;
    return d.message || d.detail || d.error;
  }
  return undefined;
}

/* ✅ ดึง startISO จากหลายฟิลด์ที่เป็นไปได้ */
function getStartISO(a: ActivityThumbnailResponse): string | null {
  const anyA = a as any;
  return (
    a?.start_at ??
    anyA?.startISO ??
    anyA?.startAt ??
    anyA?.date ?? // กรณี thumbnail ส่งเป็น "YYYY-MM-DD"
    null
  );
}

export function useActivity() {
  const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<
    ActivityThumbnailResponse[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<ActivityCategory[]>(
    []
  );
  /* ✅ state ตัวกรองเวลา */
  const [timeFilter, setTimeFilter] = useState<TimeFilter | null>(null);

  const knownCategories = useMemo(
    () => new Set<ActivityCategory>(FILTER_OPTIONS),
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    let canceled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get<ActivityThumbnailResponse[]>(
          apiRoutes.getAllActivitiesThumbnails,
          { withCredentials: true, timeout: 10000, signal: controller.signal }
        );

        if (!canceled) {
          const list = Array.isArray(data) ? data : [];
          setActivities(list);
          setFilteredActivities(list);
        }
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;
        let message = "โหลดข้อมูลล้มเหลว";
        if (axios.isAxiosError(err)) {
          const ax = err as AxiosError<unknown>;
          message =
            getServerMessage(ax.response?.data) || ax.message || message;
        } else if (err instanceof Error) {
          message = err.message || message;
        }
        if (!canceled) setError(message);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => {
      canceled = true;
      controller.abort();
    };
  }, []);

  const handleFilterChange = useCallback((value: ActivityCategory) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedFilters([]);
    setSearchText("");
    setTimeFilter(null); // ✅ รีเซ็ตตัวกรองเวลา
  }, []);

  const normQ = useMemo(() => searchText.trim().toLowerCase(), [searchText]);

  useEffect(() => {
    const extractCategory = (
      a: ActivityThumbnailResponse
    ): ActivityCategory | undefined => {
      const maybe = a as unknown as MaybeCategory;
      return (
        normalizeCategory(maybe.category) ??
        normalizeCategory(maybe.category_code) ??
        undefined
      );
    };

    /* ✅ today แบบมี fallback และใช้ฟิลด์ m0/d ให้ถูกต้อง */
    const now = new Date();
    const today = ymdInBangkok(now.toISOString()) ?? {
      y: now.getFullYear(),
      m0: now.getMonth(),
      d: now.getDate(),
    };

    const next = activities.filter((a) => {
      // 1) ค้นหาตามข้อความ
      const title = (a.title ?? "").toLowerCase();
      const matchText = normQ === "" ? true : title.includes(normQ);

      // 2) หมวดหมู่
      const activeFilters = selectedFilters;
      const category = extractCategory(a);

      let matchCategory: boolean;
      if (activeFilters.length === 0) {
        matchCategory = true;
      } else if (activeFilters.includes(ActivityCategory.Others)) {
        const isKnown = category ? knownCategories.has(category) : false;
        matchCategory =
          (category && activeFilters.includes(category)) || !isKnown;
      } else {
        matchCategory = !!category && activeFilters.includes(category);
      }

      if (!(matchText && matchCategory)) return false;

      // 3) ✅ ช่วงเวลา
      if (!timeFilter) return true;

      const iso = getStartISO(a);
      if (!iso) return false; // ถ้าไม่รู้วันเวลา เมื่อมี timeFilter ให้ตัดทิ้ง

      const parts = ymdInBangkok(iso);
      if (!parts) return false;

      if (timeFilter === TimeFilter.TODAY) {
        return (
          parts.y === today.y && parts.m0 === today.m0 && parts.d === today.d
        );
      }
      if (timeFilter === TimeFilter.THIS_MONTH) {
        return parts.y === today.y && parts.m0 === today.m0;
      }
      return true;
    });

    setFilteredActivities(next);
  }, [activities, selectedFilters, normQ, knownCategories, timeFilter]);

  const handleSearch = useCallback(() => {}, []);

  return {
    activities,
    filteredActivities,
    loading,
    error,

    searchText,
    setSearchText,

    selectedFilters,
    setSelectedFilters,
    handleFilterChange,
    resetFilters,

    /* ✅ ส่ง state/time filter ออกไปให้หน้าใช้ */
    timeFilter,
    setTimeFilter,

    handleSearch,
  };
}
