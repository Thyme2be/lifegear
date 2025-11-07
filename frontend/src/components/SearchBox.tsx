"use client";

import React, { useId, useMemo } from "react";
import { IoIosSearch } from "react-icons/io";
import { ActivityCategory, CategoryLabels } from "@/lib/enums/activity";
import clsx from "clsx";

export interface SearchBoxProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedFilters: ActivityCategory[];
  onFilterChange: (value: ActivityCategory) => void;
  onSubmit?: () => void;           
  isLoading?: boolean;        
  className?: string;               
}

// สร้างครั้งเดียวที่โมดูลระดับบน ลด re-render cost
const FILTER_OPTIONS: ActivityCategory[] = Object.values(ActivityCategory) as ActivityCategory[];

function SearchBoxBase({
  searchText,
  onSearchTextChange,
  selectedFilters,
  onFilterChange,
  onSubmit,
  className,
}: SearchBoxProps) {
  const groupId = useId();

  // ป้องกัน CategoryLabels[category] undefined (เชิงป้องกันไว้)
  const items = useMemo(
    () =>
      FILTER_OPTIONS.map((category) => ({
        category,
        label: CategoryLabels[category] ?? String(category),
      })),
    []
  );

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <aside
      className={clsx(
        "sm:col-span-1 bg-white rounded-4xl shadow p-4 space-y-4",
        className
      )}
      aria-label="ตัวกรองและค้นหากิจกรรม"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* ช่องค้นหา */}
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            placeholder="ค้นหา..."
            aria-label="ค้นหากิจกรรม"
            autoComplete="off"
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <IoIosSearch
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none"
          />
        </div>

        {/* Checkbox filter */}
        <fieldset
          aria-labelledby={`${groupId}-legend`}
          className="space-y-2 text-sm"
        >
          <legend id={`${groupId}-legend`} className="sr-only">
            เลือกหมวดหมู่กิจกรรม
          </legend>

          <ul className="space-y-2">
            {items.map(({ category, label }) => {
              const id = `${groupId}-${category}`;
              const checked = selectedFilters.includes(category);
              return (
                <li key={category} className="flex items-center">
                  <input
                    id={id}
                    name="activity-categories"
                    type="checkbox"
                    checked={checked}
                    onChange={() => onFilterChange(category)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-gray-300 cursor-pointer"
                  />
                  <label htmlFor={id} className="cursor-pointer select-none">
                    {label}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </form>
    </aside>
  );
}

const SearchBox = React.memo(SearchBoxBase);
export default SearchBox;
