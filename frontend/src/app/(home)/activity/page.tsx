"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ActivityList from "@/components/ActivityList";
import { ActivityThumbnailResponse } from "@/types/activity";
import SearchBox from "@/components/SearchBox";
import { ActivityCategory } from "@/lib/enums/activity";
import { apiRoutes } from "@/lib/apiRoutes";

const FILTER_OPTIONS = Object.values(ActivityCategory) as ActivityCategory[];

const NORMALIZE_MAP: Record<string, ActivityCategory> = {
  academic: ActivityCategory.Academics,
  academics: ActivityCategory.Academics,
  recreation: ActivityCategory.Recreations,
  recreations: ActivityCategory.Recreations,
  social: ActivityCategory.Socials,
  socials: ActivityCategory.Socials,
  other: ActivityCategory.Others,
  others: ActivityCategory.Others,
};

function normalizeCategory(input: unknown): ActivityCategory | null {
  if (typeof input !== "string") return null;
  const val = input.toLowerCase();

  if (val in NORMALIZE_MAP) return NORMALIZE_MAP[val];

  if ((Object.values(ActivityCategory) as string[]).includes(val)) {
    return val as ActivityCategory;
  }
  return null;
}

type MaybeCategory = {
  category?: unknown;
  category_code?: unknown;
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<ActivityCategory[]>([]);

  // เก็บ Set ของหมวดเพื่อเช็ค “รู้จัก/ไม่รู้จัก” เร็วขึ้น และไม่ recreate
  const knownCategories = useMemo(() => new Set<ActivityCategory>(FILTER_OPTIONS), []);

  // โหลดข้อมูลแบบยกเลิกได้เมื่อ unmount (axios v1 รองรับ signal)
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<ActivityThumbnailResponse[]>(
          apiRoutes.getAllActivitiesThumbnails,
          { withCredentials: true, timeout: 10000, signal: controller.signal }
        );
        setActivities(data);
        setFilteredActivities(data); 
      } catch (err: unknown) {
        if (axios.isCancel(err)) return; 
        const message = err instanceof Error ? err.message : "โหลดข้อมูลล้มเหลว";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleFilterChange = useCallback((value: ActivityCategory) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  }, []);

  // กรองเมื่อกด Search 
  const handleSearch = useCallback(() => {
    const q = searchText.trim().toLowerCase();
    const active = selectedFilters;

    const next = activities.filter((a) => {
      const title = (a.title ?? "").toLowerCase();
      const matchText = q === "" ? true : title.includes(q);

      // ไม่เลือก filter ใด ๆ => ดูแต่ข้อความ
      if (active.length === 0) return matchText;

      // ดึง category จากหลายคีย์
      const maybe = a as unknown as MaybeCategory;
      const cat =
        normalizeCategory(maybe.category) ?? normalizeCategory(maybe.category_code);

      // ถ้ามี Others: ให้ผ่านกรณี category ที่ไม่รู้จักด้วย
      if (active.includes(ActivityCategory.Others)) {
        const isKnown = cat ? knownCategories.has(cat) : false;
        const matchFilter = (cat && active.includes(cat)) || !isKnown;
        return matchText && matchFilter;
      }

      return matchText && !!cat && active.includes(cat);
    });

    setFilteredActivities(next);
  }, [activities, knownCategories, searchText, selectedFilters]);

  if (loading) {
    return <p className="p-6 text-gray-600">กำลังโหลดกิจกรรม…</p>;
  }
  if (error) {
    return <p className="p-6 text-red-600">เกิดข้อผิดพลาด: {error}</p>;
  }

  return (
    <main className="min-h-screen w-full bg-[#f6f1e7] p-6 flex flex-col items-center">
      <h1 className="mb-8 mt-2 heading text-[#730217] text-center">
        กิจกรรมภายในคณะวิศวกรรมศาสตร์
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-6 items-start">
        <SearchBox
          searchText={searchText}
          onSearchTextChange={setSearchText}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onSubmit={handleSearch}
        />

        <section className="sm:col-span-3 space-y-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityList key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-gray-500 flex items-center justify-center text-3xl">
              ไม่พบกิจกรรมที่ตรงกับการค้นหา
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
