// src/app/(home)/activity/page.tsx
"use client";

import React from "react";
import SearchBox from "@/components/SearchBox";
import { useActivity } from "@/hooks/useActivity";
import ActivityCarousel from "@/components/ActivityCarousel";

export default function ActivityPage() {
  const {
    filteredActivities,
    loading,
    error,
    searchText,
    setSearchText,
    selectedFilters,
    handleFilterChange,
    timeFilter,
    setTimeFilter,
  } = useActivity();

  // Loading (อ่านได้ด้วย screen reader)
  if (loading) {
    return (
      <main className="min-h-screen w-full bg-primary px-4 sm:px-6 lg:px-8 py-6 pt-24">
        <p className="text-gray-600" aria-live="polite">
          กำลังโหลดกิจกรรม…
        </p>
      </main>
    );
  }

  // Error (อ่านได้ด้วย screen reader)
  if (error) {
    return (
      <main className="min-h-screen w-full bg-primary flex items-center justify-center px-4">
        <p className="text-red-600" role="alert" aria-live="assertive">
          เกิดข้อผิดพลาด: {error}
        </p>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen bg-primary
        px-4 sm:px-6 lg:px-8 py-6
      "
    >
      <div className="w-full max-w-7xl mx-auto">
        <header>
          <h1 className="mb-8 mt-2 heading text-main text-center">
            กิจกรรมภายในคณะวิศวกรรมศาสตร์
          </h1>
        </header>

        {/* Layout: Sidebar (Search) + Content (Carousel) */}
        <div
          className="
            grid gap-6
            grid-cols-1 lg:grid-cols-4
            items-start
          "
        >
          {/* Sidebar: Search */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <SearchBox
              searchText={searchText}
              onSearchTextChange={setSearchText}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              isLoading={loading}
            />
          </aside>

          {/* Content */}
          <section className="lg:col-span-3 space-y-6">
            {/* แสดงเฉพาะเมื่อมีรายการ เพื่อไม่ให้มีช่องว่างเปล่า */}
            {filteredActivities.length > 0 && (
              <ActivityCarousel activities={filteredActivities} />
            )}

            {filteredActivities.length === 0 && (
              <div className="flex items-center justify-center py-16">
                <p className="sm:text-3xl md:2xl text-xl text-gray-500 text-center">
                  ไม่พบกิจกรรมที่ตรงกับการค้นหา
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
