"use client";

import React, { useMemo, useState, useEffect } from "react";
import ActivityList from "@/components/ActivityList";
import SlideButton from "@/components/SlideButton";
import type { ActivityThumbnailResponse } from "@/types/activities";

type Props = {
  activities: (ActivityThumbnailResponse & { slug?: string })[];
  pageSize?: number; // default 5
  className?: string;
};

function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function ActivityCarousel({
  activities,
  pageSize = 5,
  className,
}: Props) {
  const pages = useMemo(
    () => chunk(activities ?? [], pageSize),
    [activities, pageSize]
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (page >= pages.length) setPage(Math.max(0, pages.length - 1));
  }, [pages.length, page]);

  if (!activities?.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="sm:text-3xl md:2xl text-xl text-gray-500 text-center">
          ยังไม่มีกิจกรรมให้แสดง
        </p>
      </div>
    );
  }

  return (
    <section
      className={["w-full space-y-4", className].filter(Boolean).join(" ")}
    >
      {/* แสดงการ์ดกิจกรรม */}
      {pages[page]?.map((a, idx) => (
        <ActivityList key={a.id ?? `${a.slug}-${page}-${idx}`} activity={a} />
      ))}

      {/* ปุ่มนำทางล่าง */}
      <div className="flex w-full justify-center items-center gap-2 py-4">
        <SlideButton
          kind="prev"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        />

        <div className="flex gap-2">
          {pages.map((_, i) => (
            <SlideButton
              key={i}
              kind="number"
              size="sm"
              numberLabel={i + 1}
              active={i === page}
              onClick={() => setPage(i)}
            />
          ))}
        </div>

        <SlideButton
          kind="next"
          size="sm"
          disabled={page === pages.length - 1}
          onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
        />
      </div>
    </section>
  );
}
