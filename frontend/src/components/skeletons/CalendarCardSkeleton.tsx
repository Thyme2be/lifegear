"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarCardSkeleton() {
  return (
    <section
      aria-label="กำลังโหลดปฏิทินรายเดือน"
      className="rounded-xl border-4 border-[#D1B79E] bg-[#FFF8E7] shadow-md p-2 sm:p-3"
    >
      {/* แถวชื่อวัน */}
      <div className="grid grid-cols-7 text-center font-semibold pb-2 border-b text-main text-[12px] sm:text-sm md:text-base">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-8 mx-auto rounded" />
        ))}
      </div>

      {/* ช่องวันที่ (7x6) */}
      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-2.5">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border bg-white aspect-square p-1 sm:p-1.5 flex flex-col"
          >
            <Skeleton className="h-3 w-6 ml-auto rounded mb-1" />
            <div className="space-y-1">
              <Skeleton className="h-2 w-4/5 rounded" />
              <Skeleton className="h-2 w-3/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
