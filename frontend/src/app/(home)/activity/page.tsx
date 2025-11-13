// src/app/(home)/activity/page.tsx
"use client";

import React from "react";
import SearchBox from "@/components/SearchBox";
import { useActivity } from "@/hooks/useActivity";
import ActivityCarousel from "@/components/ActivityCarousel";
import ErrorBox from "@/components/ui/ErrorBox";

// skeletons
import ActivityHeaderSkeleton from "@/components/skeletons/ActivityHeaderSkeleton";
import SearchBoxSkeleton from "@/components/skeletons/SearchBoxSkeleton";
import ActivityListSkeleton from "@/components/skeletons/ActivityListSkeleton";

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

  return (
    <main className="min-h-screen bg-primary px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        {loading ? (
          <ActivityHeaderSkeleton />
        ) : (
          <header>
            <h1 className="mb-8 mt-2 heading text-main text-center">
              กิจกรรมภายในคณะวิศวกรรมศาสตร์
            </h1>
          </header>
        )}

        {/* Layout */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 items-start">
          {/* Sidebar / Search */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            {loading ? (
              <SearchBoxSkeleton />
            ) : error ? (
              <ErrorBox message={String(error)} />
            ) : (
              <SearchBox
                searchText={searchText}
                onSearchTextChange={setSearchText}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
                isLoading={loading}
              />
            )}
          </aside>

          {/* Content */}
          <section className="lg:col-span-3 space-y-6">
            {loading ? (
              <ActivityListSkeleton count={6} />
            ) : error ? (
              <ErrorBox message={String(error)} />
            ) : filteredActivities.length > 0 ? (
              <ActivityCarousel activities={filteredActivities} />
            ) : (
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
