"use client";
import React from "react";
import SearchBox from "@/components/SearchBox";
import { useActivity } from "@/hooks/useActivity";
import ActivityList from "@/components/ActivityList";

export default function ActivityPage() {
  const {
    filteredActivities,
    loading,
    error,
    searchText,
    setSearchText,
    selectedFilters,
    handleFilterChange,
  } = useActivity();

  if (loading) {
    return <p className="p-6 text-gray-600">กำลังโหลดกิจกรรม…</p>;
  }
  if (error) {
    return <p className="p-6 text-red-600">เกิดข้อผิดพลาด: {error}</p>;
  }

  return (
    <main className="min-h-screen w-full bg-cream p-6 flex flex-col items-center">
      <h1 className="mb-8 mt-2 heading text-main text-center">
        กิจกรรมภายในคณะวิศวกรรมศาสตร์
      </h1>

      <aside className="grid grid-cols-1 w-full max-w-6xl gap-6 items-start sm:grid-cols-4 ">
        <SearchBox
          searchText={searchText}
          onSearchTextChange={setSearchText}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          isLoading={loading}
          className="sm:col-span-1"
        />

        <section className="sm:col-span-3 space-y-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityList key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="flex items-center justify-center text-3xl text-gray-500">
              ไม่พบกิจกรรมที่ตรงกับการค้นหา
            </p>
          )}
        </section>
      </aside>
    </main>
  );
}
