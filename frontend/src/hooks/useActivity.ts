// src/hooks/useActivity.ts
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios, { AxiosError } from "axios";
import type { ActivityThumbnailResponse } from "@/types/activities";
import { ActivityCategory } from "@/lib/enums/activity";
import { apiRoutes } from "@/lib/apiRoutes";
import { normalizeCategory } from "@/utils/activityUtils";

type MaybeCategory = {
  category?: unknown;
  category_code?: unknown;
};

type ServerError = {
  message?: string;
  detail?: string;
  error?: string;
};

const FILTER_OPTIONS = Object.values(ActivityCategory) as ActivityCategory[];

/** ดึงข้อความจาก server response แบบ type-safe */
function getServerMessage(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const d = data as ServerError;
    return d.message || d.detail || d.error;
  }
  return undefined;
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

  // Set ของหมวดที่รองรับ (ไม่ recreate)
  const knownCategories = useMemo(
    () => new Set<ActivityCategory>(FILTER_OPTIONS),
    []
  );

  // โหลดข้อมูล (ยกเลิกได้)
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

  // toggle filter รายตัว
  const handleFilterChange = useCallback((value: ActivityCategory) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  }, []);

  // reset ฟิลเตอร์ทั้งหมด
  const resetFilters = useCallback(() => {
    setSelectedFilters([]);
    setSearchText("");
  }, []);

  // สตริงค้นหาแบบ normalize (lowercase+trim)
  const normQ = useMemo(() => searchText.trim().toLowerCase(), [searchText]);

  // คำนวณผลกรองทุกครั้งที่ activities/filters/searchText เปลี่ยน
  useEffect(() => {
    // ฟังก์ชันช่วยอ่านหมวดจาก activity (รองรับ category|category_code)
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

    const activeFilters = selectedFilters;

    const next = activities.filter((a) => {
      const title = (a.title ?? "").toLowerCase();
      const matchText = normQ === "" ? true : title.includes(normQ);

      if (activeFilters.length === 0) return matchText;

      const category = extractCategory(a);

      // ถ้าเลือก Others → ให้รายการที่ category ไม่รู้จักผ่านด้วย
      if (activeFilters.includes(ActivityCategory.Others)) {
        const isKnown = category ? knownCategories.has(category) : false;
        const matchFilter =
          (category && activeFilters.includes(category)) || !isKnown;
        return matchText && matchFilter;
      }

      return matchText && !!category && activeFilters.includes(category);
    });

    setFilteredActivities(next);
  }, [activities, selectedFilters, normQ, knownCategories]);

  // สำหรับกรณีอยากมีปุ่ม Search ชัด ๆ (ทางเลือก)
  const handleSearch = useCallback(() => {
    // ไม่ต้องทำอะไร เพราะ useEffect ด้านบนจะรันเองจาก state ปัจจุบัน
  }, []);

  return {
    activities,
    filteredActivities,
    loading,
    error,

    // search
    searchText,
    setSearchText,

    // filters
    selectedFilters,
    setSelectedFilters,
    handleFilterChange,
    resetFilters,

    // optional: ปุ่ม search
    handleSearch,
  };
}
