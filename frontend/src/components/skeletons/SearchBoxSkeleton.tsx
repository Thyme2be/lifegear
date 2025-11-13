// src/components/skeletons/SearchBoxSkeleton.tsx
"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchBoxSkeleton() {
  return (
    <aside className="bg-white rounded-4xl shadow p-4 space-y-4">
      <Skeleton className="h-10 w-full rounded-full" />{/* input */}
      <div className="space-y-2 text-sm">
        <Skeleton className="h-5 w-24 rounded-md" />{/* ชื่อส่วน: ช่วงเวลา */}
        <div className="flex gap-3 flex-wrap">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <Skeleton className="h-5 w-36 rounded-md" />{/* ชื่อส่วน: หมวดหมู่ */}
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-3/4 rounded-md" />
        ))}
      </div>
    </aside>
  );
}
