// src/components/SearchBox.tsx
"use client";

import React, { useId, useMemo } from "react";
import { IoIosSearch } from "react-icons/io";
import { ActivityCategory, CategoryLabels } from "@/lib/enums/activity";
import clsx from "clsx";

/* ✅ เพิ่ม enum สำหรับตัวกรองเวลา */
export enum TimeFilter {
  TODAY = "today",
  THIS_MONTH = "this_month",
}
const TimeFilterLabels: Record<TimeFilter, string> = {
  [TimeFilter.TODAY]: "วันนี้",
  [TimeFilter.THIS_MONTH]: "เดือนนี้",
};

export interface SearchBoxProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedFilters: ActivityCategory[];
  onFilterChange: (value: ActivityCategory) => void;
  /* ✅ เพิ่ม prop สำหรับตัวกรองเวลา */
  timeFilter?: TimeFilter | null;
  onTimeFilterChange?: (value: TimeFilter | null) => void;

  onSubmit?: () => void;
  isLoading?: boolean;
  className?: string;
}

const FILTER_OPTIONS: ActivityCategory[] = Object.values(
  ActivityCategory
) as ActivityCategory[];

function SearchBoxBase({
  searchText,
  onSearchTextChange,
  selectedFilters,
  onFilterChange,
  timeFilter,
  onTimeFilterChange,
  onSubmit,
  className,
}: SearchBoxProps) {
  const groupId = useId();

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
      <form onSubmit={handleFormSubmit} className="space-y-6">
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

        {/* ✅ ตัวกรองช่วงเวลา */}
          <div role="group" aria-label="ช่วงเวลา" className="space-y-2 text-sm">
            <div className="font-semibold">ช่วงเวลา</div>
            <div className="flex gap-3 flex-wrap">
              {(Object.values(TimeFilter) as TimeFilter[]).map((value) => {
                const active = timeFilter === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onTimeFilterChange?.(active ? null : value)}
                    className={clsx(
                      "px-3 py-1.5 rounded-full border select-none transition cursor-pointer",
                      active
                        ? "bg-main text-white border-main"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    {TimeFilterLabels[value]}
                  </button>
                );
              })}
            </div>
          </div>

        {/* ฟิลเตอร์หมวดหมู่ */}
        <fieldset
          aria-labelledby={`${groupId}-legend`}
          className="space-y-2 text-sm"
        >
          <legend id={`${groupId}-legend`} className="font-semibold">
            หมวดหมู่กิจกรรม
          </legend>
          <ul className="space-y-1">
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
