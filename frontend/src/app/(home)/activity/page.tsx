"use client";

import React, { useEffect, useState } from "react";
import ActivityList from "@/components/ActivityList";
import axios from "axios";
import { ActivityThumbnailResponse } from "@/lib/types";
import SearchBox from "@/components/SearchBox";
import { ActivityCategory } from "@/lib/enums/activity";
import { apiRoutes } from "@/lib/apiRoutes";

const filterOptions = [
  "ทั้งหมด", // "All" option
  ...Object.values(ActivityCategory),
];

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<
    ActivityThumbnailResponse[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); // start empty

  useEffect(() => {
    setLoading(true);
    axios
      .get<ActivityThumbnailResponse[]>(apiRoutes.getAllActivitiesThumbnails, {
        withCredentials: true,
      })
      .then((response) => {
        setActivities(response.data);
        setFilteredActivities(response.data); // initialize filteredActivities
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (label: string) => {
    setSelectedFilters(
      (prev) =>
        prev.includes(label)
          ? prev.filter((f) => f !== label) // remove if already selected
          : [...prev, label] // add if new
    );
  };

  const handleSearch = () => {
    const activeFilters =
      selectedFilters.length > 0 ? selectedFilters : ["ทั้งหมด"];

    const filtered = activities.filter((activity) => {
      const matchText = activity.title
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      let matchFilter = false;
      if (activeFilters.includes("ทั้งหมด")) {
        matchFilter = true;
      } else if (activeFilters.includes("other")) {
        matchFilter = !filterOptions.some(
          (f) => f !== "ทั้งหมด" && f !== "other" && activity.category === f
        );
      } else {
        matchFilter = activeFilters.includes(activity.category);
      }

      return matchText && matchFilter;
    });

    setFilteredActivities(filtered);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="min-h-screen w-full bg-[#f6f1e7] p-6 flex flex-col items-center">
      <h1 className="mb-8 text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#730217]">
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
            <p className="text-gray-500 text-center">
              ไม่พบกิจกรรมที่ตรงกับการค้นหา
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
