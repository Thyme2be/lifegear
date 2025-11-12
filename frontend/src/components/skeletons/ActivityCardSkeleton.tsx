// src/components/skeletons/ActivityCardSkeleton.tsx
"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityCardSkeleton() {
  return (
    <article className="group block w-full">
      <div className="bg-white rounded-4xl shadow-lg/15 p-4">
        {/* รูป (โครงเดียวกับของจริง): aspect + overflow + shadow */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-4xl shadow-xl">
          {/* เติมเต็มพื้นที่รูปให้เนียน */}
          <Skeleton className="absolute inset-0" />
        </div>

        {/* เนื้อหา */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-3/4 rounded-md" /> {/* ชื่อกิจกรรม */}
            <Skeleton className="h-4 w-1/2 rounded-md" /> {/* วันที่ */}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Skeleton className="h-10 w-28 rounded-full" /> {/* ปุ่ม Add */}
            <Skeleton className="h-10 w-32 rounded-full" /> {/* ปุ่ม อ่านเพิ่มเติม */}
          </div>
        </div>
      </div>
    </article>
  );
}
