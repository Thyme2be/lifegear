"use client";

import React from "react";
import { IoIosSearch } from "react-icons/io";

interface SearchBoxProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedFilters: string[];
  onFilterChange: (value: string) => void;
  onSubmit?: () => void;
}

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

export default function SearchBox({
  searchText,
  onSearchTextChange,
  selectedFilters,
  onFilterChange,
  onSubmit,
}: SearchBoxProps) {
  return (
    <aside className="sm:col-span-1 bg-white rounded-4xl shadow p-4 space-y-4">
      {/* ช่องค้นหา */}
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="ค้นหา..."
          className="w-full rounded-full border shadow-md border-white px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        {/* ไอคอน search */}
        <IoIosSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-xl pointer-events-none" />
      </div>

      {/* Checkbox filter */}
      <div className="space-y-2 text-sm">
       {filterOptions.map((label, idx) => (
          <label key={idx} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFilters.includes(label)}
              onChange={() => onFilterChange(label)}
              className="cursor-pointer shadow-[4px_4px_12px_rgba(156,163,175,0.25),-4px_-4px_12px_rgba(156,163,175,0.25)]"

            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <button 
       onClick={onSubmit}
      className="w-full bg-[#F1D500] text-black font-bold py-2 rounded-full shadow-md hover:bg-[#e0c603] transition cursor-pointer">
        ค้นหา
      </button>
    </aside>
  );
}
