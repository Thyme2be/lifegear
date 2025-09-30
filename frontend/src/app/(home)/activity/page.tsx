"use client";

import React, { useState, useEffect } from "react";
import SearchBox from "@/components/SearchBox";
import ActivityBanner from "@/components/ActivityList";

const filterOptions = [
  "ทั้งหมด",
  "ด้านดนตรี",
  "ด้านกีฬาและการออกกำลังกาย",
  "ด้านศิลปะและวัฒนธรรม",
  "ด้านวิชาการและเทคโนโลยี",
  "ด้านสังคมและบำเพ็ญประโยชน์",
  "ด้านวิชาชีพและทักษะอาชีพ",
  "ด้านนันทนาการและสันทนาการ",
  "ด้านจิตใจและคุณธรรม",
  "อื่นๆ",
];

const activities = [
  { id: 1, imageSrc: "/activityImages/1.png", altText: "กิจกรรม 1", category: "ด้านจิตใจและคุณธรรม", link: "/subActivity/1" },
  { id: 2, imageSrc: "/activityImages/3.png", altText: "กิจกรรม 2", category: "ด้านวิชาชีพและทักษะอาชีพ", link: "/subActivity/2" },
  { id: 3, imageSrc: "/activityImages/5.png", altText: "กิจกรรม 3", category: "ด้านวิชาการและเทคโนโลยี", link: "/subActivity/3" },
  { id: 4, imageSrc: "/activityImages/7.png", altText: "กิจกรรม 4", category: "ด้านนันทนาการและสันทนาการ", link: "/subActivity/4" },
  { id: 5, imageSrc: "/activityImages/9.png", altText: "กิจกรรม 5", category: "ด้านวิชาการและเทคโนโลยี", link: "/subActivity/5" },
  { id: 6, imageSrc: "/activityImages/11.png", altText: "กิจกรรม 6", category: "ด้านกีฬาและการออกกำลังกาย", link: "/subActivity/6" },
  { id: 7, imageSrc: "/activityImages/13.png", altText: "กิจกรรม 7", category: "ด้านนันทนาการและสันทนาการ", link: "/subActivity/7" },
  { id: 8, imageSrc: "/activityImages/15.png", altText: "กิจกรรม 8", category: "ด้านนันทนาการและสันทนาการ", link: "/subActivity/8" },
  { id: 9, imageSrc: "/activityImages/17.png", altText: "กิจกรรม 9", category: "ด้านวิชาชีพและทักษะอาชีพ", link: "/subActivity/9" },
  { id: 10, imageSrc: "/activityImages/19.png", altText: "กิจกรรม 10", category: "ด้านวิชาการและเทคโนโลยี", link: "/subActivity/10" },
];

export default function ActivityPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); // 🟢 เริ่มต้นว่าง
  const [filteredActivities, setFilteredActivities] = useState(activities);

  const handleFilterChange = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((f) => f !== label) // ถ้าเลือกแล้วกดยกเลิก → เอาออก
        : [...prev, label] // ถ้าเลือกใหม่ → เพิ่มเข้าไป
    );
  };

  const handleSearch = () => {
    // 🟢 ถ้าไม่เลือกอะไรเลย = แสดงทั้งหมด
    const activeFilters = selectedFilters.length > 0 ? selectedFilters : ["ทั้งหมด"];

    const filtered = activities.filter((act) => {
      const matchText = act.altText.toLowerCase().includes(searchText.toLowerCase());

      let matchFilter = false;
      if (activeFilters.includes("ทั้งหมด")) {
        matchFilter = true;
      } else if (activeFilters.includes("อื่นๆ")) {
        matchFilter = !filterOptions.some(
          (f) => f !== "ทั้งหมด" && f !== "อื่นๆ" && act.category === f
        );
      } else {
        matchFilter = activeFilters.includes(act.category);
      }

      return matchText && matchFilter;
    });

    setFilteredActivities(filtered);
  };

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
            filteredActivities.map((item) => (
              <ActivityBanner
                key={item.id}
                imageSrc={item.imageSrc}
                altText={item.altText}
                link={item.link}
              />
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