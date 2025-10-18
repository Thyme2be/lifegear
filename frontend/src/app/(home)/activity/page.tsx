"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ActivityList from "@/components/ActivityList";
import { ActivityThumbnailResponse } from "@/lib/types";
import SearchBox from "@/components/SearchBox";
import { ActivityCategory } from "@/lib/enums/activity";
import { apiRoutes } from "@/lib/apiRoutes";

// ให้ TypeScript มั่นใจว่าเป็น ActivityCategory[]
const filterOptions = Object.values(ActivityCategory) as ActivityCategory[];

// อ่านค่า category ที่อาจมาจากหลายคีย์/หลายรูปแบบ แล้วแปลงเป็น enum
function normalizeCategory(input: unknown): ActivityCategory | null {
  if (typeof input !== "string") return null;
  const val = input.toLowerCase();

  // รองรับทั้งเอกพจน์/พหูพจน์ และตรงกับ enum อยู่แล้ว
  const map: Record<string, ActivityCategory> = {
    academic: ActivityCategory.Academics,
    academics: ActivityCategory.Academics,
    recreation: ActivityCategory.Recreations,
    recreations: ActivityCategory.Recreations,
    social: ActivityCategory.Socials,
    socials: ActivityCategory.Socials,
    other: ActivityCategory.Others,
    others: ActivityCategory.Others,
  };

  if (val in map) return map[val];

  // กรณี backend ส่งค่าที่ตรง enum อยู่แล้ว
  if ((Object.values(ActivityCategory) as string[]).includes(val)) {
    return val as ActivityCategory;
  }
  return null;
}

// บอกว่า object นี้ “อาจ” มีคีย์ category/category_code ก็ได้
type MaybeCategory = {
  category?: unknown;
  category_code?: unknown;
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<ActivityCategory[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<ActivityThumbnailResponse[]>(
          apiRoutes.getAllActivitiesThumbnails,
          { withCredentials: true, timeout: 10000 }
        );
        setActivities(data);
        setFilteredActivities(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "โหลดข้อมูลล้มเหลว";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFilterChange = (value: ActivityCategory) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  // ✅ กรองบน client ให้รองรับ category หลายชื่อคีย์
  const handleSearch = () => {
    const q = searchText.trim().toLowerCase();
    const active = selectedFilters;

    const filtered = activities.filter((a) => {
      const title = (a.title ?? "").toLowerCase();
      const matchText = q === "" ? true : title.includes(q);

      if (active.length === 0) return matchText;

      // อ่านค่า category จาก a (ซึ่งอาจจะไม่มีคีย์ก็ได้)
      const maybe = a as unknown as MaybeCategory;
      const cat =
        normalizeCategory(maybe.category) ??
        normalizeCategory(maybe.category_code);

      if (active.includes(ActivityCategory.Others)) {
        const known = new Set<ActivityCategory>(filterOptions);
        const isKnown = cat ? known.has(cat) : false;
        const matchFilter = (cat && active.includes(cat)) || !isKnown;
        return matchText && matchFilter;
      }

      return matchText && !!cat && active.includes(cat);
    });

    setFilteredActivities(filtered);
  };

  if (loading) return <p className="p-6 text-gray-600">กำลังโหลดกิจกรรม…</p>;
  if (error) return <p className="p-6 text-red-600">เกิดข้อผิดพลาด: {error}</p>;

  return (
    <main className="min-h-screen w-full bg-[#f6f1e7] p-6 flex flex-col items-center">
      <h1 className="mb-8 mt-5 text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#730217]">
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
